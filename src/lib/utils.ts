import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata string para máscara de CNPJ 00.000.000/0001-00
 */
export function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Validação do algoritmo oficial do CNPJ
 */
export function isValidCnpj(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return false;
  if (/^(\d)\1+$/.test(clean)) return false;

  let size = clean.length - 2;
  let numbers = clean.substring(0, size);
  const digits = clean.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  size = size + 1;
  numbers = clean.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(digits.charAt(1));
}

/**
 * Traduz mensagens técnicas de erro do Supabase para português amigável
 */
export function translateAuthError(error: unknown): string {
  if (!error) return "Ocorreu um erro inesperado. Tente novamente.";
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Invalid login credentials") || message.includes("invalid_credentials")) {
    return "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
  }
  if (message.includes("Email not confirmed")) {
    return "E-mail ainda não confirmado. Verifique a caixa de entrada da sua empresa.";
  }
  if (message.includes("User already registered") || message.includes("already registered")) {
    return "Este e-mail corporativo já está cadastrado no PRISMA ONE.";
  }
  if (message.includes("Password should be at least")) {
    return "A senha deve ter no mínimo 8 caracteres.";
  }
  if (message.includes("rate limit") || message.includes("over_request_rate_limit")) {
    return "Muitas tentativas em sequência. Por favor, aguarde alguns minutos.";
  }
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "Falha de conexão com os servidores. Verifique sua internet e tente novamente.";
  }
  return message || "Não foi possível completar a operação.";
}
