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
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/schema/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { InferType } from "yup";

const SigninForm = () => {
  const [pendingAuth, setPendingAuth] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: InferType<typeof signInSchema>) => {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPendingAuth(true);
          setFormError("");
        },
        onSuccess: () => {
          toast.success("Login successful");
          router.push("/profile");
          router.refresh();
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
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your account details to login
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
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
              Sign In
            </Button>

            <div className="relative py-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-card px-2 font-medium text-muted-foreground select-none">
                OR
              </span>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={pendingAuth}
                onClick={() => signIn.social({ provider: "google" })}
              >
                <FaGoogle />
                <span>Login with Google</span>
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-center text-sm">
          <span className="text-muted-foreground">
            Don&apos;t have an account?
          </span>
          <Link
            href="/auth/sign-up"
            className="underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-hidden"
          >
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SigninForm;
