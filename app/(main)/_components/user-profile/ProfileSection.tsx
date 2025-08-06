"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ProfileSkleton from "@/components/skeleton/ProfileSkleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfile, UserReward } from "@/lib/dataTypes";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import ResetPassword from "./ResetPassword";
import { StatsCards } from "./StatsCards";

// Main Profile Page Component
const ProfileSection = () => {
  const { user, videos, rewards, stats, isLoading, error, mutate, libVideos } =
    useUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

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
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Profile update failed:", errorData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleResetPassword = () => {
    setIsResetPasswordModalOpen(true);
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
      <ProfileHeader
        user={user as UserProfile}
        isLoading={isLoading}
        onEditClick={handleEditProfile}
        onResetPasswordClick={handleResetPassword}
      />

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

      <EditProfileModal
        user={user as UserProfile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
      {/* reset password modal  */}
      <ResetPassword
        user={user as UserProfile}
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfileSection;
