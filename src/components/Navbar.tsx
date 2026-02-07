"use client";

import { Box, Flex, Heading, Button, Text } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <Box bgGradient="linear(to-r, blue.700, blue.500)" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} boxShadow="sm">
      <Flex maxW="container.lg" mx="auto" align="center" justify="space-between">
        <Heading
          size={{ base: "sm", md: "md" }}
          letterSpacing="tight"
          fontWeight="bold"
        >
          Hábitos de la Mañana
        </Heading>
        {session?.user && (
          <Flex align="center" gap={{ base: 2, md: 4 }}>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
            >
              {session.user.name}
            </Text>
            <Button
              size="sm"
              bg="white"
              color="blue.700"
              borderColor="white"
              _hover={{ bg: "blue.100", color: "blue.800" }}
              onClick={() => signOut({ callbackUrl: "/login" })}
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="bold"
              boxShadow="sm"
            >
              Cerrar sesión
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
