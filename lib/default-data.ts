import { DemoCenter } from "./dataTypes";

export const defaultPaginatedData = {
  data: [],
  meta: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const demoCentersData: DemoCenter[] = [
  {
    id: 1,
    name: "Hardcore Fitness Huntington Beach",
    type: "business",
    address: {
      street: "17711 Crabb Ln",
      city: "Huntington Beach",
      state: "CA",
      zipCode: "92647",
    },
    phone: "714-912-1923",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    bio: "Premier fitness facility offering state-of-the-art equipment and personalized training programs. Our Huntington Beach location features the latest in fitness technology and a supportive community atmosphere.",
    equipment: [
      "Power Racks",
      "Smith Machines",
      "Cardio Equipment",
      "Free Weights",
      "Cable Machines",
    ],
    hours: {
      weekdays: {
        open: "5:00 AM",
        close: "8:15 PM",
      },
      weekends: {
        open: "6:00 AM",
        close: "12:00 PM",
      },
    },
    availability: "Contact for availability",
    distance: 2.5,
  },
  {
    id: 2,
    name: "Hardcore Fitness Long Beach",
    type: "business",
    address: {
      street: "301 Pine Ave",
      city: "Long Beach",
      state: "CA",
      zipCode: "90802",
    },
    phone: "719-552-2767",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sat=-50",
    bio: "Our Long Beach facility combines modern fitness equipment with expert guidance. Featuring specialized training areas and group fitness classes for all fitness levels.",
    equipment: [
      "Squat Racks",
      "Bench Press",
      "Deadlift Platforms",
      "Cardio Machines",
      "Functional Training Area",
    ],
    hours: {
      weekdays: {
        open: "5:00 AM",
        close: "9:00 PM",
      },
      weekends: {
        open: "5:00 AM",
        close: "9:00 PM",
      },
    },
    availability: "Contact for availability",
    distance: 3.5,
  },
  {
    id: 3,
    name: "Elite Fitness Center Irvine",
    type: "isolator",
    address: {
      street: "456 Technology Dr",
      city: "Irvine",
      state: "CA",
      zipCode: "92618",
    },
    phone: "949-555-1234",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sat=-30",
    bio: "Specialized isolation training facility focusing on targeted muscle development. Our Irvine location offers cutting-edge isolation equipment for precise workout routines.",
    equipment: [
      "Isolation Machines",
      "Cable Crossovers",
      "Leg Press",
      "Lat Pulldown",
      "Seated Rows",
    ],
    hours: {
      weekdays: {
        open: "6:00 AM",
        close: "10:00 PM",
      },
      weekends: {
        open: "7:00 AM",
        close: "8:00 PM",
      },
    },
    availability: "Appointment required",
    distance: 4.5,
  },
  {
    id: 4,
    name: "Powerhouse Gym Anaheim",
    type: "business",
    address: {
      street: "789 Disney Way",
      city: "Anaheim",
      state: "CA",
      zipCode: "92802",
    },
    phone: "714-555-9876",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sat=-20",
    bio: "Comprehensive fitness center serving the Anaheim community. Features a wide range of equipment for strength training, cardio, and functional fitness.",
    equipment: [
      "Power Racks",
      "Olympic Platforms",
      "Cardio Equipment",
      "Group Fitness Studio",
      "Recovery Area",
    ],
    hours: {
      weekdays: {
        open: "4:30 AM",
        close: "11:00 PM",
      },
      weekends: {
        open: "5:00 AM",
        close: "10:00 PM",
      },
    },
    availability: "Walk-ins welcome",
    distance: 9.3,
  },
];
