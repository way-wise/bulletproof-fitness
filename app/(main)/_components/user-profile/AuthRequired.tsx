"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import Link from "next/link";

export const AuthRequired = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card>
        <CardContent className="p-12 text-center">
          <LogIn className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please sign in to view your profile and manage your account.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
