"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePasswordFormSchema } from "@/utils/form-schemas";

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export default function PasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormData) {
    console.log(data);
  }
  return (
    <Form {...form}>
      <form
        className="w-full max-w-md mx-auto space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input {...field} type={showPassword ? "text" : "password"} />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                className="absolute right-0 bottom-0"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              >
                {showPassword ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeClosedIcon className="size-4" />
                )}
              </Button>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  className="relative"
                />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                className="absolute right-0 bottom-0"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                variant="ghost"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeClosedIcon className="size-4" />
                )}
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
