declare global {
  interface Window {
    cloudinary: any;
  }
}

// Secure upload using our API route
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/cloudinary", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Upload failed");
  }

  const data = await response.json();
  return data.url;
};

// Simple file input upload (more reliable than widget)
export const uploadImageViaFileInput = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      try {
        const imageUrl = await uploadToCloudinary(file);
        resolve(imageUrl);
      } catch (error) {
        reject(error);
      }
    };

    input.click();
  });
};

// Cloudinary Upload Widget (for advanced features)
export const openCloudinaryUploadWidget = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      reject(new Error("Cloudinary cloud name not configured"));
      return;
    }

    // Load Cloudinary widget script if not already loaded
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.onload = () => {
        createUploadWidget(resolve, reject);
      };
      script.onerror = () => {
        console.error(
          "Failed to load Cloudinary widget, falling back to file input",
        );
        // Fallback to file input if widget fails to load
        uploadImageViaFileInput().then(resolve).catch(reject);
      };
      document.head.appendChild(script);
    } else {
      createUploadWidget(resolve, reject);
    }
  });
};

const createUploadWidget = (
  resolve: (url: string) => void,
  reject: (error: Error) => void,
) => {
  try {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "ml_default", // You can create a custom upload preset for better security
        sources: ["local", "camera"],
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        folder: "profile-images",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
        maxFileSize: 5000000, // 5MB
        showAdvancedOptions: false,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary widget error:", error);
          reject(new Error(error.message || "Upload failed"));
          return;
        }

        if (result.event === "success") {
          resolve(result.info.secure_url);
        } else if (result.event === "close") {
          reject(new Error("Upload cancelled"));
        }
      },
    );

    widget.open();
  } catch (error) {
    console.error("Error creating Cloudinary widget:", error);
    // Fallback to file input if widget creation fails
    uploadImageViaFileInput().then(resolve).catch(reject);
  }
};
