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
    newPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
    confirmNewPassword: z.string().min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });
