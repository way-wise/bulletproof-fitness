"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/validators/authValidators";
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
import Link from "next/link";

const SigninForm = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log(values);
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your account details to login</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldset>
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
            <Button type="submit" className="mt-4 w-full">
              Sign In
            </Button>

            <div className="relative py-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-medium text-muted-foreground">
                OR
              </span>
            </div>

            <div className="space-y-3">
              <Button type="button" variant="secondary" className="w-full">
                <FcGoogle className="size-5" />
                <span>Login with Google</span>
              </Button>

              <Button type="button" variant="secondary" className="w-full">
                <FaLinkedin className="size-5 text-[#0072b1]" />
                <span>Login with LinkedIn</span>
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-5 space-x-1 text-center text-sm">
          <span>Don&apos;t have an account?</span>
          <Link href="/auth/sign-up" className="font-medium underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SigninForm;
