// src/lib/auth-errors.ts
type BetterAuthClientError =
  | string
  | { message?: string; error?: { code?: string; message?: string } | string }
  | { status?: number; statusText?: string; message?: string };

const ptBR: Record<string, string> = {
  INVALID_USERNAME_OR_PASSWORD: "Email ou senha inválidos.",
  EMAIL_NOT_VERIFIED: "E-mail não verificado.",
  USER_ALREADY_EXISTS: "Usuário já existe.",
  WEAK_PASSWORD: "Senha muito fraca.",
  RATE_LIMITED: "Muitas tentativas. Tente novamente mais tarde.",
  UNEXPECTED_ERROR: "Erro inesperado.",
};

export function translateAuthError(e: BetterAuthClientError): string {
  // Plain string error
  if (typeof e === "string") return e || "Erro desconhecido";

  // Message at root
  if (e && typeof e === "object" && typeof e.message === "string") {
    return e.message || "Erro desconhecido";
  }

  // Fetch Response-like
  if (typeof Response !== "undefined" && e instanceof Response) {
    if (e.status === 401) return "Não autorizado. Faça login novamente.";
    if (e.status === 403) return "Acesso negado.";
    if (e.status === 429) return ptBR.RATE_LIMITED;
    return e.statusText || "Erro desconhecido";
  }

  // Plain object with status fields
  if (e && typeof e === "object") {
    const status = (e as { status?: number }).status;
    const statusText = (e as { statusText?: string }).statusText;
    if (typeof status === "number") {
      if (status === 401) return "Não autorizado. Faça login novamente.";
      if (status === 403) return "Acesso negado.";
      if (status === 429) return ptBR.RATE_LIMITED;
      return statusText || `Erro (${status})`;
    }
  }

  // Nested error shape
  const nested = (e as { error?: unknown })?.error;
  if (typeof nested === "string") return nested || "Erro desconhecido";

  if (nested && typeof nested === "object") {
    const code = (nested as { code?: string }).code;
    if (code && ptBR[code]) return ptBR[code];
    const msg = (nested as { message?: string }).message;
    if (typeof msg === "string" && msg) return msg;
  }

  return "Erro desconhecido";
}
