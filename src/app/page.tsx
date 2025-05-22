import React from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { Calculator, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Simulador de viabilidad
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Simula la viabilidad de tu modelo de negocio
              <span className="text-primary"> sin conocimientos financieros</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              LeanSim te ayuda a evaluar la viabilidad básica de tu idea de negocio con métricas
              clave y resultados comprensibles.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/simulation">
                  <Calculator className="h-5 w-5" />
                  Iniciar simulación
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/historial">
                  Ver historial
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-medium">Sencillo</h3>
                <p className="text-sm text-muted-foreground">Interfaz intuitiva en 3 pasos</p>
              </div>
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-medium">Educativo</h3>
                <p className="text-sm text-muted-foreground">Aprende mientras planificas</p>
              </div>
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-medium">Práctico</h3>
                <p className="text-sm text-muted-foreground">Conoce KPIs esenciales</p>
              </div>
            </div>
          </div>
          <div className="bg-accent rounded-xl p-8 border shadow-md hidden lg:block">
            {" "}
            <Image
              src="/assets/startup-dashboard.svg"
              alt="LeanSim Dashboard Preview"
              className="w-full rounded-lg"
              width={500}
              height={400}
            />{" "}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
