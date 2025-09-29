import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, Video } from "lucide-react";
import Link from "next/link";

export default function FormsButtonPage() {
  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-xl bg-gray-600/90 p-8 text-black shadow">
        <div className="text-center">
          {/* Video Camera Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Main Text */}
          <div className="mb-4 text-white">
            <h1 className="text-2xl font-bold tracking-wide">
              PLEASE CREATE ACCOUNT
            </h1>
            <h2 className="text-lg font-semibold tracking-wide">
              TO UPLOAD A VIDEO
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-white">Create an account to get started</p>

          {/* Action Button */}
          <div className="py-4">
            <Link href="/auth/sign-up">
              <Button
                className="w-full cursor-pointer bg-black py-3 font-semibold text-white hover:bg-black/90"
                size="lg"
              >
                <UserPlus className="size-5" />
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
                className="text-blue-300 hover:underline"
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
