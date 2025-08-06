"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { uploadImageViaFileInput } from "@/lib/cloudinaryClient";
import { UserProfile } from "@/lib/dataTypes";
import React, { useEffect, useState } from "react";

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
}

export const EditProfileModal = ({
  user,
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
    });
  }, [user]);

  const handleImageUpload = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadImageViaFileInput();
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      if (error instanceof Error && error.message === "No file selected") {
        // User cancelled the file selection, don't show error
        return;
      }
      setUploadError("Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Call the onSave prop with the form data
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      setUploadError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full rounded-md border p-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full rounded-md border p-2"
                required
              />
            </div>

            {/* Profile Image Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Profile Image</label>

              {/* Current Image Preview */}
              {formData.image && (
                <div className="flex items-center space-x-3">
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="h-16 w-16 rounded-full border object-cover"
                  />
                </div>
              )}

              {/* Upload Button */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageUpload}
                  disabled={isUploading || isSaving}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Image"
                  )}
                </Button>

                {/* Error Message */}
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isUploading || isSaving}
              >
                {isSaving ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isUploading || isSaving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
