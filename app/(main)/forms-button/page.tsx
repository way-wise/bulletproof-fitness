import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, Video } from "lucide-react";
import Link from "next/link";

export default function FormsButtonPage() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-purple-600 text-white p-8 rounded-xl shadow-lg">
        <div className="text-center space-y-6">
          {/* Video Camera Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Main Text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-wide">
              PLEASE CREATE ACCOUNT
            </h1>
            <h2 className="text-xl font-semibold tracking-wide">
              TO UPLOAD A VIDEO
            </h2>
          </div>
          
          {/* Subtitle */}
          <p className="text-white/90 text-sm">
            Create an account to get started
          </p>
          
          {/* Action Button */}
          <div className="pt-4">
            <Link href="/auth/sign-up">
              <Button 
                className="w-full cursor-pointer bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3"
                size="lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
          
          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-white/80 text-sm">
              Already have an account?{" "}
              <Link 
                href="/auth/sign-in" 
                className="text-white font-semibold hover:underline"
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
