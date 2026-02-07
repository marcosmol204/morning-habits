"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Box, Heading, Flex, Text, Spinner, SimpleGrid } from "@chakra-ui/react";
import { HABITS } from "@/config/habits";

interface MonthlyGridProps {
  refreshTrigger?: number;
}

interface DayData {
  date: string;
  completedCount: number;
  percentage: number;
}

const formatTooltip = (day: DayData) => {
  const d = new Date(day.date + "T00:00:00");
  const formatted = d.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
  return `${formatted}: ${day.completedCount}/${HABITS.length} (${day.percentage}%)`;
};

const getColor = (percentage: number): string => {
  if (percentage === 0) return "gray.200";
  if (percentage <= 25) return "green.200";
  if (percentage <= 50) return "green.300";
  if (percentage <= 75) return "green.400";
  return "green.500";
};

export default function MonthlyGrid({ refreshTrigger }: MonthlyGridProps) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  const startStr = start.toISOString().split("T")[0];
  const endStr = end.toISOString().split("T")[0];
  const { data, error, isLoading } = useSWR(`/api/habits/range?start=${startStr}&end=${endStr}`, fetcher);

  let days: DayData[] = [];
  if (data && data.entries) {
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const habits = data.entries[dateStr] || {};
      const completedCount = Object.values(habits).filter(Boolean).length;
      const percentage = Math.round((completedCount / HABITS.length) * 100);
      days.push({ date: dateStr, completedCount, percentage });
    }
  }

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
        <Text color="red.500">Error al cargar el mes.</Text>
      </Box>
    );
  }

  const monthTotal = days.reduce((acc, d) => acc + d.completedCount, 0);
  const monthMax = days.length * HABITS.length;
  const monthPercentage = Math.round((monthTotal / monthMax) * 100);
  const perfectDays = days.filter((d) => d.percentage === 100).length;

  return (
    <Box bg="white" p={{ base: 2, md: 4 }} borderRadius="2xl" borderWidth={1} boxShadow={{ base: "sm", md: "md" }}>
      <Flex justify="space-between" align="center" mb={4} direction={{ base: "column", sm: "row" }} gap={2}>
        <Heading size={{ base: "sm", md: "md" }}>Últimos 30 días</Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
          {monthPercentage}% total
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 5, sm: 10 }} gap={1}>
        {days.map((day) => (
          <Box
            key={day.date}
            bg={getColor(day.percentage)}
            w="100%"
            h={{ base: "14px", md: "20px" }}
            borderRadius="sm"
            title={formatTooltip(day)}
            cursor="default"
          />
        ))}
      </SimpleGrid>

      <Flex mt={4} justify="space-between" fontSize={{ base: "xs", md: "sm" }} color="gray.500" direction={{ base: "column", sm: "row" }} gap={2}>
        <Text>Días perfectos: {perfectDays}</Text>
        <Flex align="center" gap={1}>
          <Text>Menos</Text>
          <Box w="12px" h="12px" bg="gray.200" borderRadius="sm" />
          <Box w="12px" h="12px" bg="green.200" borderRadius="sm" />
          <Box w="12px" h="12px" bg="green.300" borderRadius="sm" />
          <Box w="12px" h="12px" bg="green.400" borderRadius="sm" />
          <Box w="12px" h="12px" bg="green.500" borderRadius="sm" />
          <Text>Más</Text>
        </Flex>
      </Flex>
    </Box>
  );
}
