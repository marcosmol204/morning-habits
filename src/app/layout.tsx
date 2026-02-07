import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";

export const metadata: Metadata = {
  title: "Rastreador de Hábitos Matutinos",
  description: "Registra tus hábitos matutinos y construye constancia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
