"use client";

import { useState, useCallback, useEffect } from "react";
import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { Habit } from "@/config/habits";

interface HabitCheckboxProps {
  habit: Habit;
  checked: boolean;
  inputs?: string[];
  onToggle: (habitKey: string, checked: boolean) => void;
  onInputsChange?: (habitKey: string, inputs: string[]) => void;
  disabled?: boolean;
}

export default function HabitCheckbox({
  habit,
  checked,
  inputs = [],
  onToggle,
  onInputsChange,
  disabled = false,
}: HabitCheckboxProps) {
  const count = habit.inputCount ?? 0;
  const hasInputs = count >= 1;

  const safeInputs = Array.isArray(inputs) ? inputs : [];
  const propValues = Array.from({ length: count }, (_, i) => safeInputs[i] ?? "");

  const [localInputs, setLocalInputs] = useState<string[]>(propValues);

  useEffect(() => {
    const fromProp = Array.from({ length: count }, (_, i) => safeInputs[i] ?? "");
    setLocalInputs(fromProp);
  }, [JSON.stringify(safeInputs), count]);

  const handleBlur = useCallback(() => {
    if (!onInputsChange || !hasInputs) return;
    const toSave = Array.from({ length: count }, (_, i) => localInputs[i] ?? "").slice(0, count);
    if (toSave.some((s) => s.trim() !== "")) {
      onInputsChange(habit.key, toSave);
    }
  }, [habit.key, count, hasInputs, localInputs, onInputsChange]);

  const handleInputChange = (index: number, value: string) => {
    setLocalInputs((prev) => {
      const next = [...(prev.length >= count ? prev : Array(count).fill(""))];
      next[index] = value;
      return next;
    });
  };

  const inputValues = localInputs.length >= count ? localInputs : [...localInputs, ...Array(count - localInputs.length).fill("")];

  const allInputsFilled = inputValues.slice(0, count).every((val) => val && val.trim().length > 0);
  const isCheckboxDisabled = disabled || (hasInputs && !allInputsFilled);

  return (
    <Box
      as="label"
      display="flex"
      flexDirection="column"
      p={{ base: 2, md: 3 }}
      bg={checked ? "green.50" : "white"}
      borderWidth={1}
      borderColor={checked ? "green.300" : (isCheckboxDisabled && hasInputs ? "gray.100" : "gray.200")}
      borderRadius="lg"
      cursor={isCheckboxDisabled ? "not-allowed" : "default"}
      opacity={disabled ? 0.6 : 1}
      transition="all 0.2s"
      _hover={{ borderColor: isCheckboxDisabled ? undefined : "blue.300" }}
      boxShadow={checked ? "sm" : undefined}
    >
      <Flex align="center" gap={2} mb={hasInputs ? 3 : 0}>
        {!hasInputs && (
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onToggle(habit.key, e.target.checked)}
            disabled={isCheckboxDisabled}
            style={{
              width: "22px",
              height: "22px",
              marginRight: "12px",
              accentColor: checked ? "#38A169" : "#CBD5E0",
              cursor: isCheckboxDisabled ? "not-allowed" : "pointer",
            }}
          />
        )}
        <Text fontSize={{ base: "lg", md: "xl" }}>{habit.icon}</Text>
        <Text
          fontWeight={checked ? "semibold" : "normal"}
          color={checked ? "green.700" : "gray.700"}
          fontSize={{ base: "sm", md: "md" }}
        >
          {habit.label}
        </Text>
        {hasInputs && (
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onToggle(habit.key, e.target.checked)}
            disabled={isCheckboxDisabled}
            style={{
              width: "22px",
              height: "22px",
              marginLeft: "auto",
              accentColor: checked ? "#38A169" : "#CBD5E0",
              cursor: isCheckboxDisabled ? "not-allowed" : "pointer",
            }}
          />
        )}
      </Flex>

      {hasInputs && count >= 1 && (
        <Flex direction="column" gap={2} pl={{ base: 0, md: "42px" }}>
          {Array.from({ length: count }).map((_, i) => (
            <Input
              key={i}
              placeholder={count === 1 ? "Escribe aquí..." : `Gratitud ${i + 1}...`}
              value={inputValues[i] ?? ""}
              onChange={(e) => handleInputChange(i, e.target.value)}
              onBlur={handleBlur}
              disabled={disabled}
              size="sm"
              borderRadius="md"
              borderColor="gray.200"
              _placeholder={{ color: "gray.400" }}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}
