"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

interface HabitsContextProps {
    habits: Record<string, boolean>;
    habitInputs: Record<string, string[]>;
    isLoading: boolean;
    error: any;
    updating: string | null;
    handleToggle: (habitKey: string, completed: boolean) => Promise<void>;
    updateHabitInputs: (habitKey: string, inputs: string[]) => Promise<void>;
    mutate: () => void;
}

const HabitsContext = createContext<HabitsContextProps | undefined>(undefined);

interface HabitsProviderProps {
    date: string;
    initialHabits?: Record<string, boolean>;
    initialHabitInputs?: Record<string, string[]>;
    children: React.ReactNode;
}

export function HabitsProvider({ date, initialHabits, initialHabitInputs, children }: HabitsProviderProps) {
    const { mutate: globalMutate } = useSWRConfig();
    const [updating, setUpdating] = useState<string | null>(null);
    const { data, error, isLoading, mutate } = useSWR(`/api/habits?date=${date}`, fetcher, {
        fallbackData:
            initialHabits != null || initialHabitInputs != null
                ? {
                      habits: initialHabits ?? {},
                      habitInputs: initialHabitInputs ?? {},
                  }
                : undefined,
        revalidateOnMount: true,
    });
    const habits = data?.habits || {};
    const habitInputs = data?.habitInputs || {};

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

    const updateHabitInputs = useCallback(
        async (habitKey: string, inputs: string[]) => {
            setUpdating(habitKey);
            mutate(
                (current: any) => ({
                    ...current,
                    habits: { ...current?.habits, [habitKey]: true },
                    habitInputs: { ...current?.habitInputs, [habitKey]: inputs },
                }),
                false
            );
            try {
                const res = await fetch("/api/habits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ date, habitKey, inputs }),
                });
                if (!res.ok) {
                    mutate();
                } else {
                    globalMutate((key) => typeof key === "string" && key.includes("/api/habits/range"));
                }
            } catch (err) {
                console.error("Failed to update habit inputs:", err);
                mutate();
            } finally {
                setUpdating(null);
            }
        },
        [date, mutate, globalMutate]
    );

    return (
        <HabitsContext.Provider
            value={{ habits, habitInputs, isLoading, error, updating, handleToggle, updateHabitInputs, mutate }}
        >
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
