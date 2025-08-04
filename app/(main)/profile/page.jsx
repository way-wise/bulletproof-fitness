"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSession } from "@/lib/auth-client";
import React, { useState } from "react";
import { AuthRequired } from "../_components/user-profile/AuthRequired";
import { EditProfileModal } from "../_components/user-profile/EditProfileModal";
import { ProfileHeader } from "../_components/user-profile/ProfileHeader";
import { ProfileTabs } from "../_components/user-profile/ProfileTabs";
import { StatsCards } from "../_components/user-profile/StatsCards";

// Main Profile Page Component
const ProfilePage = () => {
  const { data: session } = useSession();
  const { user, videos, rewards, stats, isLoading, error, mutate } =
    useUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (formData) => {
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        mutate(); // Refresh data
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Profile update failed:", errorData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Debug logging
  React.useEffect(() => {
    console.log("Profile data:", {
      user,
      videos,
      rewards,
      stats,
      isLoading,
      error,
    });
    console.log("Session:", session);
  }, [user, videos, rewards, stats, isLoading, error, session]);

  // Show auth required if not signed in
  if (!session) {
    return <AuthRequired />;
  }

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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <ProfileHeader
        user={user}
        isLoading={isLoading}
        onEditClick={handleEditProfile}
      />

      <StatsCards stats={stats} isLoading={isLoading} />

      <ProfileTabs
        user={user}
        videos={videos}
        rewards={rewards}
        stats={stats}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
