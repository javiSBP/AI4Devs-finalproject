import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-8">LeanSim</h1>
        <p className="text-xl mb-8">
          Simulador de modelos de negocio para emprendedores.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg">
            Comenzar
          </Button>
          <Button variant="outline" size="lg">
            Aprender más
          </Button>
        </div>
      </div>
    </main>
  );
}
