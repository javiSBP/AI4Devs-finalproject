"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="border-b bg-background">
      <div className="container py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/historial">
              <History className="h-4 w-4 mr-2" />
              Historial
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
