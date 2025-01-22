"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/validators/authValidators";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { FormError } from "@/components/ui/form-error";
import { toast } from "sonner";
import Link from "next/link";

const SignupForm = () => {
  const [formError, setFormError] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setFormError("");
        },
        onSuccess: () => {
          toast.success("Registration successful");
          router.push("/dashboard");
          router.refresh();
        },
        onError: (ctx) => {
          setFormError(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldset disabled={form.formState.isSubmitting}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              isLoading={form.formState.isSubmitting}
            >
              Sign Up
            </Button>

            <div className="relative py-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-medium text-muted-foreground">
                OR
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 md:flex-row">
              <Button type="button" variant="secondary" className="w-full">
                <FcGoogle className="size-5" />
                <span>Google</span>
              </Button>

              <Button type="button" variant="secondary" className="w-full">
                <FaLinkedin className="size-5 text-[#0072b1]" />
                <span>LinkedIn</span>
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-5 space-x-1 text-center text-sm">
          <span>Already have an account?</span>
          <Link href="/auth/sign-in" className="font-medium underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
