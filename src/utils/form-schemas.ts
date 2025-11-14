import z from "zod";

export const signInFormSchema = z.object({
  email: z
    .email({
      message: "Email inválido",
    })
    .min(1, {
      message: "Email é obrigatório",
    }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres",
  }),
});

export const forgotPasswordFormSchema = z.object({
  email: z
    .email({
      message: "Email inválido",
    })
    .min(1, {
      message: "Email é obrigatório",
    }),
});

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    confirmPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "Nome é obrigatório",
      })
      .refine((data) => data.split(" ").length >= 2, {
        message: "Por favor, insira seu nome e sobrenome",
        path: ["name"],
      }),
    email: z
      .email({
        message: "Email inválido",
      })
      .min(1, {
        message: "Email é obrigatório",
      }),
    password: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    confirmPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    favoriteNumber: z.number().int().min(1, {
      message: "Número é obrigatório",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const profileUpdateSchema = z.object({
  name: z.string(),
  email: z.email(),
  favoriteNumber: z.number().int().min(1, { message: "Número é obrigatório" }),
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    newPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    confirmNewPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    revokeOtherSessions: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export const twoFactorAuthSchema = z.object({
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});

export const qrCodeVerifySchema = z.object({
  token: z.string().length(6, {
    message: "Token precisa ter 6 dígitos",
  }),
});

export const TotpFormSchema = z.object({
  code: z.string().length(6, {
    message: "Código precisa ter 6 dígitos",
  }),
});

export const BackupCodeFormSchema = z.object({
  code: z.string().min(1, {
    message: "Código é obrigatório",
  }),
});
