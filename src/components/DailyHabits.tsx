"use client";

import { HabitsProvider, useHabits } from "./HabitsContext";
import { Box, Heading, Text, VStack, Spinner, Flex } from "@chakra-ui/react";
import { HABITS } from "@/config/habits";
import HabitCheckbox from "./HabitCheckbox";

interface DailyHabitsProps {
  date: string;
  initialHabits?: Record<string, boolean>;
  onUpdate?: () => void;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function DailyHabitsContent({ date }: { date: string }) {
  const { habits, isLoading, error, updating, handleToggle } = useHabits();
  const completedCount = Object.values(habits).filter(Boolean).length;
  const percentage = Math.round((completedCount / HABITS.length) * 100);

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">Error al cargar los hábitos.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }} mb={4} gap={2}>
        <Box>
          <Heading size={{ base: "sm", md: "md" }} mb={1} fontWeight="bold">
            Hábitos de hoy
          </Heading>
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            {formatDate(date)}
          </Text>
        </Box>
        <Box textAlign={{ base: "left", sm: "right" }} mt={{ base: 2, sm: 0 }}>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={percentage === 100 ? "green.500" : "blue.500"}>
            {completedCount}/{HABITS.length}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
            {percentage}% completado
          </Text>
        </Box>
      </Flex>

      <VStack gap={{ base: 1, md: 2 }} align="stretch">
        {HABITS.map((habit) => (
          <HabitCheckbox
            key={habit.key}
            habit={habit}
            checked={habits[habit.key] || false}
            onToggle={handleToggle}
            disabled={updating === habit.key}
          />
        ))}
      </VStack>
    </Box>
  );
}

export default function DailyHabits({ date, initialHabits }: DailyHabitsProps) {
  return (
    <HabitsProvider date={date} initialHabits={initialHabits}>
      <DailyHabitsContent date={date} />
    </HabitsProvider>
  );
}
