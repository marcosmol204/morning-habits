"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Box, Heading, Flex, Text, Spinner } from "@chakra-ui/react";
import { HABITS } from "@/config/habits";

interface WeeklyGridProps {
  refreshTrigger?: number;
}

interface DayData {
  date: string;
  habits: Record<string, boolean>;
  completedCount: number;
  percentage: number;
}

export default function WeeklyGrid({ refreshTrigger }: WeeklyGridProps) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startStr = start.toISOString().split("T")[0];
  const endStr = end.toISOString().split("T")[0];
  const { data, error, isLoading } = useSWR(`/api/habits/range?start=${startStr}&end=${endStr}`, fetcher);
  let days: DayData[] = [];
  if (data && data.entries) {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const habits = data.entries[dateStr] || {};
      const completedCount = Object.values(habits).filter(Boolean).length;
      const percentage = Math.round((completedCount / HABITS.length) * 100);
      days.push({ date: dateStr, habits, completedCount, percentage });
    }
  }

  const getColor = (percentage: number): string => {
    if (percentage === 0) return "gray.200";
    if (percentage <= 25) return "green.200";
    if (percentage <= 50) return "green.300";
    if (percentage <= 75) return "green.400";
    return "green.500";
  };

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "short" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.getDate().toString();
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="md" color="blue.500" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="red.500">Error al cargar la semana.</Text>
      </Box>
    );
  }

  const weekTotal = days.reduce((acc, d) => acc + d.completedCount, 0);
  const weekMax = days.length * HABITS.length;
  const weekPercentage = Math.round((weekTotal / weekMax) * 100);

  return (
    <Box bg="white" p={{ base: 2, md: 4 }} borderRadius="2xl" borderWidth={1} boxShadow={{ base: "sm", md: "md" }}>
      <Flex justify="space-between" align="center" mb={4} direction={{ base: "column", sm: "row" }} gap={2}>
        <Heading size={{ base: "sm", md: "md" }}>Últimos 7 días</Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
          {weekPercentage}% total
        </Text>
      </Flex>

      <Flex justify="space-between" gap={2} direction={{ base: "column", sm: "row" }}>
        {days.map((day) => (
          <Box key={day.date} textAlign="center" flex={1} mb={{ base: 2, sm: 0 }}>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={1}>
              {formatDay(day.date)}
            </Text>
            <Box
              bg={getColor(day.percentage)}
              w="100%"
              h={{ base: "28px", md: "40px" }}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              title={`${day.date}: ${day.completedCount}/${HABITS.length} (${day.percentage}%)`}
              cursor="default"
            >
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color={day.percentage > 50 ? "white" : "gray.700"}>
                {formatDate(day.date)}
              </Text>
            </Box>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={1}>
              {day.completedCount}/{HABITS.length}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
