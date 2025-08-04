import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, Video } from "lucide-react";
import Link from "next/link";

export default function FormsButtonPage() {
  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-xl bg-purple-500 p-8 text-white shadow-lg">
        <div className="space-y-6 text-center">
          {/* Video Camera Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <Video className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          {/* Main Text */}
          <div className="space-y-2 text-white">
            <h1 className="text-2xl font-bold tracking-wide">
              PLEASE CREATE ACCOUNT
            </h1>
            <h2 className="text-xl font-semibold tracking-wide">
              TO UPLOAD A VIDEO
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-white">Create an account to get started</p>

          {/* Action Button */}
          <div className="pt-4">
            <Link href="/auth/sign-up">
              <Button
                className="w-full cursor-pointer bg-white py-3 font-semibold text-purple-500 hover:bg-white/90"
                size="lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </Button>
            </Link>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-white">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="font-semibold text-white hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
