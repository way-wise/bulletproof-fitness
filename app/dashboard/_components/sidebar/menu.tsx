"use client";

import {
  BadgeCent,
  BicepsFlexed,
  Building2,
  Dumbbell,
  Home,
  LayoutGrid,
  MessageSquareMore,
  Play,
  Rows3,
  Shield,
  Trophy,
  UsersRound,
} from "lucide-react";
import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";
import { useSessionWithPermissions } from "@/hooks/useSessionWithPermissions";

const SidebarMenu = () => {
  const { data: session } = useSessionWithPermissions();

  console.log("session with permissions", session);

  // Helper function to check if user has permission
  const hasPermission = (resource: string, action: string): boolean => {
    if (!session?.user) return false;
    // Super admin has all permissions
    if (session.user.role === "super") return true;

    // Check permission using Better Auth (permissions added by admin plugin)
    const user = session.user as any;
    return (
      user.permissions?.some(
        (p: any) => p.resource === resource && p.action === action,
      ) || false
    );
  };

  const menuList = [
    {
      title: "Dashboard",
      icon: <LayoutGrid className="icon" />,
      url: "/dashboard",
      permission: { resource: "system", action: "dashboard" }, // DASHBOARD_STATS
    },
    {
      title: "Back to Home",
      icon: <Home className="icon" />,
      url: "/",
      // No permission needed - always visible
    },
    {
      title: "Users",
      icon: <UsersRound className="icon" />,
      url: "/dashboard/users",
      permission: { resource: "user", action: "list" }, // USER_LIST
    },
    {
      title: "Roles",
      icon: <Shield className="icon" />,
      url: "/dashboard/roles",
      permission: { resource: "role", action: "list" }, // ROLE_LIST
    },
    {
      title: "Points",
      icon: <BadgeCent className="icon" />,
      baseUrl: "/dashboard/points",
      permission: { resource: "points", action: "list" }, // POINTS_LIST
      submenu: [
        {
          title: "Points",
          url: "/dashboard/points",
          permission: { resource: "points", action: "list" }, // POINTS_LIST
        },
        {
          title: "Leaderboard",
          url: "/dashboard/points/leaderboard",
          permission: { resource: "contest", action: "leaderboard" }, // LEADERBOARD_LIST
        },
      ],
    },
    {
      title: "Demo Centers",
      icon: <Building2 className="icon" />,
      url: "/dashboard/demo-centers",
      permission: { resource: "demoCenter", action: "list" }, // DEMO_CENTER_LIST
    },
    {
      title: "Feedbacks",
      icon: <MessageSquareMore className="icon" />,
      url: "/dashboard/feedback",
      permission: { resource: "feedback", action: "list" }, // FEEDBACK_LIST
    },
    {
      title: "Contest",
      icon: <Trophy className="icon" />,
      url: "/dashboard/contest",
      permission: { resource: "contest", action: "view" }, // CONTEST_VIEW
    },
    {
      title: "Equipment",
      icon: <Dumbbell className="icon" />,
      url: "/dashboard/equipments",
      permission: { resource: "equipment", action: "list" }, // EQUIPMENT_LIST
    },
    {
      title: "Body Parts",
      icon: <BicepsFlexed className="icon" />,
      url: "/dashboard/body-parts",
      permission: { resource: "bodyPart", action: "list" }, // BODY_LIST
    },
    {
      title: "Racks",
      icon: <Rows3 className="icon" />,
      url: "/dashboard/racks",
      permission: { resource: "rack", action: "list" }, // RACK_LIST
    },
    {
      title: "YouTube Videos",
      icon: <Play className="icon" />,
      baseUrl: "/dashboard/exercise",
      permission: { resource: "exerciseLibrary", action: "list" }, // EXERCISE_LIBRARY_LIST
      submenu: [
        {
          title: "Exercise Library",
          url: "/dashboard/exercise-library",
          permission: { resource: "exerciseLibrary", action: "list" }, // EXERCISE_LIBRARY_LIST
        },
        {
          title: "Exercise Setup ",
          url: "/dashboard/exercise-setup",
          permission: { resource: "exerciseSetup", action: "list" }, // EXERCISE_SETUP_LIST
        },
      ],
    },
    // {
    //   title: "Settings",
    //   icon: <Settings className="icon" />,
    //   url: "/dashboard/settings",
    // },
  ];

  // Filter menu items based on permissions
  const filteredMenuList = menuList.filter((menu: any) => {
    // If no permission required, show it
    if (!menu.permission) return true;

    // Check if user has the required permission
    return hasPermission(menu.permission.resource, menu.permission.action);
  });

  return (
    <nav className="grow space-y-1.5 overflow-y-auto p-6">
      {filteredMenuList.map((menu: any, index) => {
        if (menu.submenu) {
          // Filter submenu items based on permissions
          const filteredSubmenu = menu.submenu.filter((submenu: any) => {
            // If no permission required, show it
            if (!submenu.permission) return true;
            // Check if user has the required permission
            return hasPermission(submenu.permission.resource, submenu.permission.action);
          });

          // Only show parent menu if there are visible submenu items
          if (filteredSubmenu.length === 0) return null;

          return (
            <MenuCollapsible key={index} {...menu}>
              {filteredSubmenu.map((submenu: any, index: number) => (
                <MenuCollapsibleItem key={index} {...submenu} />
              ))}
            </MenuCollapsible>
          );
        }

        return <MenuItem key={index} {...menu} />;
      })}
    </nav>
  );
};

export default SidebarMenu;
