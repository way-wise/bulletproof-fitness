import { boolean, InferType, number, object, string } from "yup";

export const rewardsSchema = object({
  name: string().required("Name is required"),
  points: number().required("Points is required"),
  description: string().optional(),
  type: string()
    .oneOf([
      "LIKE",
      "VIEW",
      "RATING",
      "UPLOAD_EXERCISE",
      "UPLOAD_LIBRARY",
      "DISLIKE",
    ])
    .required(),
  isActive: boolean().default(false),
  icon: string().optional(),
});

export type Reward = InferType<typeof rewardsSchema>;
