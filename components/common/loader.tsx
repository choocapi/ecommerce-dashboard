"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

interface LoaderProps {
  className?: string;
}

export default function Loader({ className }: LoaderProps) {
  return <Loader2Icon className={cn("size-10 animate-spin text-primary", className)} />;
}
