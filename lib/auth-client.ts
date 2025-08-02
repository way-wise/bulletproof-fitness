import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { demoCenterAdmin } from "./admin/demoCenter";
import { exerciseLibraryAdmin } from "./admin/exerciseLibrary";

const baseAuthClient = createAuthClient({
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = baseAuthClient;

export const admin = {
  ...baseAuthClient.admin,
  demoCenter: demoCenterAdmin,
  exerciseLibrary: exerciseLibraryAdmin,
};

// import { adminClient } from "better-auth/client/plugins";
// import { createAuthClient } from "better-auth/react";

// const baseAuthClient = createAuthClient({
//   plugins: [adminClient()],
// });

// // Extend the admin object with demo center methods
// const extendedAdmin = {
//   ...baseAuthClient.admin,

//   // Demo center management methods
//   blockDemoCenter: async ({
//     demoCenterId,
//     blockReason,
//   }: {
//     demoCenterId: string;
//     blockReason: string;
//   }) => {
//     try {
//       const response = await fetch("/api/demo-centers/block", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ demoCenterId, blockReason }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: { message: error.message || "Failed to block demo center" },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   unblockDemoCenter: async ({ demoCenterId }: { demoCenterId: string }) => {
//     try {
//       const response = await fetch("/api/demo-centers/unblock", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ demoCenterId }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: { message: error.message || "Failed to unblock demo center" },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   deleteDemoCenter: async ({ demoCenterId }: { demoCenterId: string }) => {
//     try {
//       const response = await fetch(`/api/demo-centers/${demoCenterId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: { message: error.message || "Failed to delete demo center" },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   updateDemoCenterStatus: async ({
//     demoCenterId,
//     isPublic,
//     blocked,
//     blockReason,
//   }: {
//     demoCenterId: string;
//     isPublic?: boolean;
//     blocked?: boolean;
//     blockReason?: string;
//   }) => {
//     try {
//       const response = await fetch(`/api/demo-centers/${demoCenterId}/status`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isPublic, blocked, blockReason }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: {
//             message: error.message || "Failed to update demo center status",
//           },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   // Exercise Library Video Management Methods
//   blockExerciseLibraryVideo: async ({
//     videoId,
//     blockReason,
//   }: {
//     videoId: string;
//     blockReason: string;
//   }) => {
//     try {
//       const response = await fetch(
//         `/api/exercise-setup/dashboard/${videoId}/block`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ blockReason }),
//         },
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: { message: error.message || "Failed to block video" },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   unblockExerciseLibraryVideo: async ({ videoId }: { videoId: string }) => {
//     try {
//       const response = await fetch(
//         `/api/exercise-setup/dashboard/${videoId}/unblock`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: { message: error.message || "Failed to unblock video" },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   deleteExerciseLibraryVideo: async ({ videoId }: { videoId: string }) => {
//     try {
//       const response = await fetch(`/api/exercise-setup/dashboard/${videoId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: { message: error.message || "Failed to delete video" },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },

//   updateExerciseLibraryVideoStatus: async ({
//     videoId,
//     isPublic,
//     blocked,
//     blockReason,
//   }: {
//     videoId: string;
//     isPublic?: boolean;
//     blocked?: boolean;
//     blockReason?: string;
//   }) => {
//     try {
//       const response = await fetch(
//         `/api/exercise-setup/dashboard/${videoId}/status`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ isPublic, blocked, blockReason }),
//         },
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         return {
//           error: {
//             message: error.message || "Failed to update video status",
//           },
//         };
//       }

//       const data = await response.json();
//       return { data };
//     } catch {
//       return { error: { message: "Network error occurred" } };
//     }
//   },
// };

// export const { signIn, signUp, signOut, useSession } = baseAuthClient;
// export const admin = extendedAdmin;
