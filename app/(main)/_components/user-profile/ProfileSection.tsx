"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileSkleton from "@/components/skeleton/ProfileSkleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfile, UserReward } from "@/lib/dataTypes";
import { useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { StatsCards } from "./StatsCards";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Lock, Mail, Trophy } from "lucide-react";
import { formatDate } from "@/lib/date-format";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/lib/auth-client";

// Main Profile Page Component
const ProfileSection = () => {
  const { user, videos, rewards, stats, isLoading, error, mutate, libVideos } =
    useUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Edit Profile Form
  const profileForm = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  // Edit Password Reset Form
  const passwordResetSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const resetPasswordForm = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSaveProfile = async (formData: Record<string, unknown>) => {
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await mutate();
        toast.success("Profile updated successfully");
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }

      profileForm.reset();
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleResetPassword = async (
    formData: z.infer<typeof passwordResetSchema>,
  ) => {
    const { error } = await changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    mutate();

    toast.success("Password updated successfully");
    setIsResetPasswordModalOpen(false);
    resetPasswordForm.reset();
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-red-500">
              Error loading profile: {error.message}
            </p>
            <Button onClick={mutate} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (isLoading || !user) {
    return <ProfileSkleton />;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="relative">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : (
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                {user?.role && <Badge variant="secondary">{user.role}</Badge>}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Member since{" "}
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">
                  {user?.totalPoints || 0} Points
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4 cursor-pointer" />
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsResetPasswordModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4 cursor-pointer" />
                Reset Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatsCards stats={stats} isLoading={isLoading} />

      <ProfileTabs
        user={user as UserProfile}
        videos={videos.map((video) => ({
          ...video,
          createdAt:
            video.createdAt instanceof Date
              ? video.createdAt.toISOString()
              : video.createdAt,
        }))}
        libVideos={libVideos.map((video) => ({
          ...video,
          createdAt:
            video.createdAt instanceof Date
              ? video.createdAt.toISOString()
              : video.createdAt,
        }))}
        rewards={rewards as UserReward[]}
        stats={stats}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isPending={profileForm.formState.isSubmitting}
      >
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(handleSaveProfile)}>
            <FormFieldset disabled={profileForm.formState.isSubmitting}>
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    profileForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={profileForm.formState.isSubmitting}
                >
                  Update
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Reset Password"
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        isPending={resetPasswordForm.formState.isSubmitting}
      >
        <Form {...resetPasswordForm}>
          <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
            <FormFieldset disabled={resetPasswordForm.formState.isSubmitting}>
              <FormField
                control={resetPasswordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Current Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setIsResetPasswordModalOpen(false);
                    resetPasswordForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={resetPasswordForm.formState.isSubmitting}
                >
                  Update
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileSection;
