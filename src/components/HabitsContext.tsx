"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

interface HabitsContextProps {
    habits: Record<string, boolean>;
    isLoading: boolean;
    error: any;
    updating: string | null;
    handleToggle: (habitKey: string, completed: boolean) => Promise<void>;
    mutate: () => void;
}

const HabitsContext = createContext<HabitsContextProps | undefined>(undefined);

interface HabitsProviderProps {
    date: string;
    initialHabits?: Record<string, boolean>;
    children: React.ReactNode;
}

export function HabitsProvider({ date, initialHabits, children }: HabitsProviderProps) {
    const { mutate: globalMutate } = useSWRConfig();
    const [updating, setUpdating] = useState<string | null>(null);
    const { data, error, isLoading, mutate } = useSWR(`/api/habits?date=${date}`, fetcher, {
        fallbackData: initialHabits ? { habits: initialHabits } : undefined,
        revalidateOnMount: true,
    });
    const habits = data?.habits || {};

    const handleToggle = useCallback(async (habitKey: string, completed: boolean) => {
        setUpdating(habitKey);
        mutate(
            (current: any) => ({
                ...current,
                habits: { ...current?.habits, [habitKey]: completed },
            }),
            false
        );
        try {
            const res = await fetch("/api/habits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, habitKey, completed }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Failed to update habit:", errorData);
                mutate();
            } else {
                // Invalidate range queries to update charts
                globalMutate((key) => typeof key === "string" && key.includes("/api/habits/range"));
            }
        } catch (error) {
            console.error("Failed to update habit:", error);
            mutate();
        } finally {
            setUpdating(null);
        }
    }, [date, mutate]);

    return (
        <HabitsContext.Provider value={{ habits, isLoading, error, updating, handleToggle, mutate }}>
            {children}
        </HabitsContext.Provider>
    );
}

export function useHabits() {
    const context = useContext(HabitsContext);
    if (!context) {
        throw new Error("useHabits must be used within a HabitsProvider");
    }
    return context;
}
