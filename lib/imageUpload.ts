export const uploadImageToImgBB = async (
  imageFile: File | null,
): Promise<string | null> => {
  if (!imageFile) {
    return null;
  }

  const apiKeys = [
    "a19be535c5fd70a3278eefbf40afd65e",
    "1ffa253fd14f954af864aa85ae82de4c",
  ];

  const formData = new FormData();
  formData.append("image", imageFile);

  for (const apiKey of apiKeys) {
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data: {
        status: number;
        data?: {
          url: string;
        };
        error?: unknown;
      } = await response.json();

      if (data.status === 200 && data.data?.url) {
        return data.data.url;
      } else {
        console.error("Image upload failed for API key:", apiKey);
      }
    } catch (error) {
      console.error("Error uploading image with API key:", apiKey, error);
    }
  }

  console.error("All API keys failed. Could not upload the image.");
  return null;
};
