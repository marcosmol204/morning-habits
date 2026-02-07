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

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but sign in failed, redirect to login
        router.push("/login");
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
                Crear una cuenta
              </Heading>
              <Text color="gray.600">Comienza a registrar tus hábitos matutinos</Text>
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
                    placeholder="Elige un usuario"
                    required
                    minLength={3}
                    maxLength={20}
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
                    placeholder="Elige una contraseña"
                    required
                    minLength={6}
                  />
                </Box>

                <Box w="100%">
                  <Text mb={1} fontSize="sm" fontWeight="medium">
                    Confirmar contraseña
                  </Text>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
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
                  Crear cuenta
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color="gray.600">
              ¿Ya tienes una cuenta?{" "}
              <ChakraLink as={NextLink} href="/login" color="blue.500">
                Inicia sesión
              </ChakraLink>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
