import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
    >
      <Rocket className="h-6 w-6 text-primary transform hover:scale-110 transition-transform duration-200" />
      <span>LeanSim</span>
    </Link>
  );
};

export default Logo;
