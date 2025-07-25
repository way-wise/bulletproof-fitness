import { UserType } from "@api/features/users/userModule";
import { hc } from "hono/client";
import { API_URL } from "./config";

export const client = hc<UserType>(`${API_URL}/users`);
