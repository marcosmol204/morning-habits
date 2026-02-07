
import { Box, Container, VStack, Heading, Text } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import DailyHabits from "@/components/DailyHabits";
import WeeklyGrid from "@/components/WeeklyGrid";
import MonthlyGrid from "@/components/MonthlyGrid";
import { getHabitsForDate } from "./getHabitsForDate";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];
  const initialHabits = await getHabitsForDate(today);

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
            <DailyHabits date={today} initialHabits={initialHabits.habits} />
          </Box>

          <Box bg="white" p={{ base: 2, md: 4 }} borderRadius="2xl" borderWidth={1} boxShadow={{ base: "sm", md: "md" }}>
            <WeeklyGrid />
          </Box>

          <Box bg="white" p={{ base: 2, md: 4 }} borderRadius="2xl" borderWidth={1} boxShadow={{ base: "sm", md: "md" }}>
            <MonthlyGrid />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
