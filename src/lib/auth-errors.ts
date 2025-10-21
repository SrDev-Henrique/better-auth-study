// src/lib/auth-errors.ts
type BetterAuthClientError = { error?: { code?: string; message?: string } };

const ptBR: Record<string, string> = {
  INVALID_USERNAME_OR_PASSWORD: "Email ou senha inválidos.",
  EMAIL_NOT_VERIFIED: "E-mail não verificado.",
  USER_ALREADY_EXISTS: "Usuário já existe.",
  WEAK_PASSWORD: "Senha muito fraca.",
  RATE_LIMITED: "Muitas tentativas. Tente novamente mais tarde.",
  UNEXPECTED_ERROR: "Erro inesperado.",
};

export function translateAuthError(e: BetterAuthClientError): string {
  const code = e?.error?.code;
  if (code && ptBR[code]) return ptBR[code];
  return e?.error?.message ?? "Erro desconhecido";
}
