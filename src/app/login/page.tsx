"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="sm">
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
          <VStack gap={6}>
            <Box textAlign="center">
              <Heading size="lg" mb={2}>
                Hábitos de la Mañana
              </Heading>
              <Text color="gray.600">Inicia sesión para registrar tus hábitos</Text>
            </Box>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <VStack gap={4}>

                <Box w="100%">
                  <Text mb={1} fontSize="sm" fontWeight="medium">
                    Usuario
                  </Text>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Introduce tu usuario"
                    required
                  />
                </Box>

                <Box w="100%">
                  <Text mb={1} fontSize="sm" fontWeight="medium">
                    Contraseña
                  </Text>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce tu contraseña"
                    required
                  />
                </Box>

                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  w="100%"
                  loading={loading}
                  disabled={loading}
                >
                  Iniciar sesión
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color="gray.600">
              ¿No tienes una cuenta?{" "}
              <ChakraLink as={NextLink} href="/register" color="blue.500">
                Regístrate
              </ChakraLink>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
