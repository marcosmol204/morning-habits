"use client";

import { useState, ReactNode } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <Box
      as="span"
      display="inline-block"
      transform={open ? "rotate(180deg)" : undefined}
      transition="transform 0.2s"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </Box>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  /** Optional summary text shown in header when open (e.g. "75% total") */
  summary?: ReactNode;
}

export default function CollapsibleSection({ title, summary, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box bg="white" p={{ base: 2, md: 4 }} borderRadius="2xl" borderWidth={1} boxShadow={{ base: "sm", md: "md" }}>
      <Flex
        as="button"
        width="100%"
        justify="space-between"
        align="center"
        mb={isOpen ? 4 : 0}
        direction={{ base: "column", sm: "row" }}
        gap={2}
        onClick={() => setIsOpen((prev) => !prev)}
        cursor="pointer"
        _hover={{ opacity: 0.9 }}
        textAlign="left"
      >
        <Flex align="center" gap={2}>
          <Heading size={{ base: "sm", md: "md" }}>{title}</Heading>
          <ChevronDownIcon open={isOpen} />
        </Flex>
        {isOpen && summary != null && (
          <Box fontSize={{ base: "sm", md: "md" }} color="gray.600" onClick={(e) => e.stopPropagation()}>
            {summary}
          </Box>
        )}
      </Flex>
      {isOpen && children}
    </Box>
  );
}
