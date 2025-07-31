// Paginated Data Types
export type PaginatedData<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type TCardType = {
  id: number;
  title: string;
  category: string;
  equipment: string;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  label: string;
  videoUrl: string;
};

export type DemoCenter = {
  id: string;
  buildingType: string;
  name: string;
  address: string;
  contact: string;
  cityZip: string;
  bio: string;
  image: string;
  availability?: string;
  weekdays: string[];
  weekends: string[];
  weekdayOpen?: string;
  weekdayClose?: string;
  weekendOpen?: string;
  weekendClose?: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
  demoCenterEquipments?: DemoCenterEquipment[];
};

export type DemoCenterEquipment = {
  id: string;
  equipment: {
    id: string;
    name: string;
  };
};

// Type for the API response
export interface DemoCenterFromAPI {
  id: string;
  buildingType: string;
  name: string;
  address: string;
  contact: string;
  cityZip: string;
  bio: string;
  image: string;
  availability?: string;
  weekdays: string[];
  weekends: string[];
  weekdayOpen?: string;
  weekdayClose?: string;
  weekendOpen?: string;
  weekendClose?: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  createdAt: string;
  updatedAt: string;
  demoCenterEquipments: Array<{
    id: string;
    equipment: {
      id: string;
      name: string;
    };
  }>;
}

export type ExerciseLibraryVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
};

// YouTube Video Types
export interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  videoId: string;
  videoUrl: string;
  thumbnail?: string;
  tags: string[];
  category: string;
  privacy: "public" | "private" | "unlisted";
  status: "uploaded" | "processing" | "failed";
  duration?: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  uploadDate: Date;
  publishedAt?: Date;
  userId: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateYouTubeVideoData {
  title: string;
  description?: string;
  videoId: string;
  videoUrl: string;
  thumbnail?: string;
  tags: string[];
  category?: string;
  privacy?: "public" | "private" | "unlisted";
  status?: "uploaded" | "processing" | "failed";
  duration?: number;
  userId: string;
  isPublic?: boolean;
}

export interface UpdateYouTubeVideoData {
  title?: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  category?: string;
  privacy?: "public" | "private" | "unlisted";
  status?: "uploaded" | "processing" | "failed";
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  publishedAt?: Date;
  isPublic?: boolean;
  blocked?: boolean;
  blockReason?: string;
}

// Type for the API response
export interface YouTubeVideoFromAPI {
  id: string;
  title: string;
  description?: string;
  videoId: string;
  videoUrl: string;
  thumbnail?: string;
  tags: string[];
  category: string;
  privacy: "public" | "private" | "unlisted";
  status: "uploaded" | "processing" | "failed";
  duration?: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  uploadDate: string;
  publishedAt?: string;
  userId: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
