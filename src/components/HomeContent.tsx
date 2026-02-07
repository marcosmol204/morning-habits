"use client";

import { Box, Container, VStack, Heading, Text } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import DailyHabits from "@/components/DailyHabits";
import WeeklyGrid from "@/components/WeeklyGrid";
import MonthlyGrid from "@/components/MonthlyGrid";
import CollapsibleSection from "@/components/CollapsibleSection";

interface HomeContentProps {
  today: string;
  initialHabits: Record<string, boolean>;
  initialHabitInputs?: Record<string, string[]>;
}

export default function HomeContent({ today, initialHabits, initialHabitInputs = {} }: HomeContentProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW={{ base: "100%", md: "container.sm" }} px={{ base: 3, md: 6 }} py={{ base: 5, md: 10 }}>
        <VStack gap={{ base: 4, md: 6 }} align="stretch">
          <Box textAlign="center" mb={{ base: 2, md: 0 }}>
            <Heading size={{ base: "md", md: "lg" }} mb={2} fontWeight="extrabold" letterSpacing="tight">
              ¡Buenos días!
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              Registra tus hábitos y construye constancia
            </Text>
          </Box>

          <Box bg="white" p={{ base: 3, md: 6 }} borderRadius="2xl" borderWidth={1} boxShadow={{ base: "md", md: "lg" }}>
            <DailyHabits date={today} initialHabits={initialHabits} initialHabitInputs={initialHabitInputs} />
          </Box>

          <CollapsibleSection title="Últimos 7 días">
            <WeeklyGrid />
          </CollapsibleSection>

          <CollapsibleSection title="Últimos 30 días">
            <MonthlyGrid />
          </CollapsibleSection>
        </VStack>
      </Container>
    </Box>
  );
}
