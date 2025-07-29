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
  id: number;
  name: string;
  type: "business" | "isolator";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  imageUrl: string;
  bio: string;
  equipment: string[];
  hours: {
    weekdays: {
      open: string;
      close: string;
    };
    weekends: {
      open: string;
      close: string;
    };
  };
  availability: string;
  distance?: number;
};
