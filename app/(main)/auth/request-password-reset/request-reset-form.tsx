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
import { requestPasswordReset } from "@/lib/auth-client";
import { requestPasswordResetSchema, signInSchema } from "@/schema/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Link from "next/link";

const RequestPasswordResetForm = () => {
  const [pendingAuth, setPendingAuth] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    values: InferType<typeof requestPasswordResetSchema>,
  ) => {
    await requestPasswordReset(
      {
        email: values.email,
        redirectTo: "/auth/reset-password",
      },
      {
        onRequest: () => {
          setPendingAuth(true);
          setFormError("");
        },
        onError: (ctx) => {
          setFormError(ctx.error.message);
        },
        onSuccess: (data) => {
          if (data?.data.status) {
            setFormError(
              "If this email exists in our system, check your email for the reset link",
            );
          }
        },
      },
    );

    setPendingAuth(false);
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-2xl">Request Password Reset</CardTitle>
        <CardDescription className="text-center">
          Enter your account email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldset disabled={pendingAuth}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
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
              Send Reset Password Link
            </Button>
          </form>
        </Form>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-center text-sm">
          <span className="text-muted-foreground">Remember Password?</span>
          <Link
            href="/auth/sign-in"
            className="underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-hidden"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestPasswordResetForm;
