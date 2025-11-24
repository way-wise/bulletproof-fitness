import { ReactionType } from "@prisma/client";

// Paginated Data Types
export type PaginatedData<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
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

type ExLibBodyPartType = {
  bodyPart: {
    id: string;
    name: string;
  };
};

export type ExerciseLibraryItem = {
  id: string;
  title: string;
  videoUrl: string;
  ExLibBodyPart: ExLibBodyPartType[];
  ExSetupBodyPart: ExLibBodyPartType[];
  equipment: {
    id: string;
    name: string;
  };
  bodyPart: {
    id: string;
    name: string;
  };
  rack?: {
    id: string;
    name: string;
  };
  height: number;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  views: number;
  likes: number;
  comments: number;
  saves: number;
  rating: number;
  label: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  isolatorHole?: string;
  yellow?: string;
  green?: string;
  blue?: string;
  red?: string;
  purple?: string;
  orange?: string;
  createdAt: string;
  updatedAt: string;
  contentStats?: contentStats[];
  reactions?: Reactions[];
  alreadyReacted: ReactionType | null;
  averageRating: number;
  dislikes: number;
};

export interface contentStats {
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  avgRating: number;
}

export type ExerciseLibraryResponse = {
  data: ExerciseLibraryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type Reactions = {
  userId: string;
  exerciseId: string;
  reaction: "LIKE" | "DISLIKE";
};

export type ExerciseLibraryFilters = {
  bodyPartIds?: string[];
  equipmentIds?: string[];
  rackIds?: string[];
  username?: string;
  minHeight?: number;
  maxHeight?: number;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
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
  lat?: number;
  lng?: number;
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
  lat?: number;
  lng?: number;
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
  videoUrl: string;
  equipment: string;
  bodyPart: string;
  height: string;
  rack: string;
  userId: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  // Pump by numbers fields
  isolatorHole?: string;
  yellow?: string;
  green?: string;
  blue?: string;
  red?: string;
  purple?: string;
  orange?: string;
  createdAt: Date;
  updatedAt: Date;
  // Junction table properties for dashboard
  ExLibEquipment?: Array<{
    equipment: {
      id: string;
      name: string;
    };
  }>;
  ExLibBodyPart?: Array<{
    bodyPart: {
      id: string;
      name: string;
    };
  }>;
  ExLibRak?: Array<{
    rack: {
      id: string;
      name: string;
    };
  }>;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type ExerciseSetupVideo = {
  id: string;
  title: string;
  videoUrl: string;
  height: number;
  userId: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason?: string;
  // Pump by numbers fields
  isolatorHole?: string;
  yellow?: string;
  green?: string;
  blue?: string;
  red?: string;
  purple?: string;
  orange?: string;
  createdAt: Date;
  updatedAt: Date;
  // Junction table properties for dashboard
  ExSetupEquipment?: Array<{
    equipment: {
      id: string;
      name: string;
    };
  }>;
  ExSetupBodyPart?: Array<{
    bodyPart: {
      id: string;
      name: string;
    };
  }>;
  ExSetupRak?: Array<{
    rack: {
      id: string;
      name: string;
    };
  }>;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  // Reaction and stats fields
  alreadyReacted: ReactionType | null;
  views: number;
  likes: number;
  averageRating: number;
  dislikes: number;
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  availablePoints: number;
  pendingPoints: number;
  createdAt: string;
  updatedAt: string;
  banned: boolean | null;
  image: string | null;
  role: string | null;
  emailVerified: boolean;
}

export type Reward = {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type UserReward = {
  id: string;
  points: number;
  createdAt: string;
  description: string | null;
  type: string;
  isActive: boolean;
  name: string | null;
  updatedAt: string;
};
