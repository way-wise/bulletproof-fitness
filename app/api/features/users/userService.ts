import prisma from "@/lib/prisma";

export const userService = {
  getUsers: async () => {
    const users = await prisma.users.findMany();
    return users;
  },
};
