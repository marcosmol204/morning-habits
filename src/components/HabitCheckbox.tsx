"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Habit } from "@/config/habits";

interface HabitCheckboxProps {
  habit: Habit;
  checked: boolean;
  onToggle: (habitKey: string, checked: boolean) => void;
  disabled?: boolean;
}

export default function HabitCheckbox({
  habit,
  checked,
  onToggle,
  disabled = false,
}: HabitCheckboxProps) {
  return (
    <Box
      as="label"
      display="flex"
      alignItems="center"
      p={{ base: 2, md: 3 }}
      bg={checked ? "green.50" : "white"}
      borderWidth={1}
      borderColor={checked ? "green.300" : "gray.200"}
      borderRadius="lg"
      cursor={disabled ? "not-allowed" : "pointer"}
      opacity={disabled ? 0.6 : 1}
      transition="all 0.2s"
      _hover={{ borderColor: disabled ? undefined : "blue.300" }}
      boxShadow={checked ? "sm" : undefined}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(habit.key, e.target.checked)}
        disabled={disabled}
        style={{
          width: "22px",
          height: "22px",
          marginRight: "12px",
          accentColor: checked ? '#38A169' : '#CBD5E0',
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      <Flex align="center" gap={2}>
        <Text fontSize={{ base: "lg", md: "xl" }}>{habit.icon}</Text>
        <Text fontWeight={checked ? "semibold" : "normal"} color={checked ? "green.700" : "gray.700"} fontSize={{ base: "sm", md: "md" }}>
          {habit.label}
        </Text>
      </Flex>
    </Box>
  );
}
