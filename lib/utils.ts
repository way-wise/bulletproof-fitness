import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge and conditionally apply Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulate delay with promise
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
