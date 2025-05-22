import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "LeanSim - Simulador de Modelos de Negocio",
  description:
    "Simulador de modelos de negocio para emprendedores. Crea, simula y valida tu idea de negocio con LeanSim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system" storageKey="leansim-ui-theme">
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
