import React from "react";
import Link from "next/link";
import { Lightbulb } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
      <Lightbulb className="h-6 w-6 text-primary" />
      <span>LeanSim</span>
    </Link>
  );
};

export default Logo;
