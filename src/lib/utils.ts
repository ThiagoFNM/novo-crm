import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function normalizePassword(password: string) {
  const senha = await password.normalize('NFKC').trim();
  return senha;
}

// captalizar e remover _
export function capitalizeAndRemoveUnderscore(str: string) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}