import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function normalizePassword(password: string) {
  const senha = await password.normalize('NFKC').trim();
  return senha;
}
