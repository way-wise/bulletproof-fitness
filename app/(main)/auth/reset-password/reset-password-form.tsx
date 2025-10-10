"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";
import { resetPasswordSchema, signInSchema } from "@/schema/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const [pendingAuth, setPendingAuth] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: InferType<typeof resetPasswordSchema>) => {
    const token = searchParams.get("token");

    if (!token) {
      setFormError("Invalid token! Please check your email again");
      return;
    }

    await resetPassword(
      {
        newPassword: values.password,
        token,
      },
      {
        onRequest: () => {
          setPendingAuth(true);
          setFormError("");
        },
        onSuccess: () => {
          toast.success("Password reset successful");
          router.replace("/auth/sign-in");
        },
        onError: (ctx) => {
          setFormError(ctx.error.message);
        },
      },
    );

    setPendingAuth(false);
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldset disabled={pendingAuth}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldset>
            <FormError message={formError} />
            <Button
              type="submit"
              className="mt-4 w-full"
              isLoading={pendingAuth}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
