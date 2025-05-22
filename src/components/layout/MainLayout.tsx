import React from "react";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">{children}</main>
      <footer className="border-t py-6 bg-card">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 LeanSim - Simula la viabilidad de tu emprendimiento
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Términos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
