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
  demoCenterEquipments?: any[];
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
