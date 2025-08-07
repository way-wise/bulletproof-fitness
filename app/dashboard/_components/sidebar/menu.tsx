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
  UsersRound,
} from "lucide-react";
import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";

const SidebarMenu = () => {
  const menuList = [
    {
      title: "Dashboard",
      icon: <LayoutGrid className="icon" />,
      url: "/dashboard",
    },
    {
      title: "Back to Home",
      icon: <Home className="icon" />,
      url: "/",
    },
    {
      title: "Users",
      icon: <UsersRound className="icon" />,
      url: "/dashboard/users",
    },
    {
      title: "Rewards",
      icon: <BadgeCent className="icon" />,
      url: "/dashboard/rewards",
    },
    {
      title: "Demo Centers",
      icon: <Building2 className="icon" />,
      url: "/dashboard/demo-centers",
    },
    {
      title: "Feedbacks",
      icon: <MessageSquareMore className="icon" />,
      url: "/dashboard/feedback",
    },
    {
      title: "Equipments",
      icon: <Dumbbell className="icon" />,
      url: "/dashboard/equipments",
    },
    {
      title: "Body Parts",
      icon: <BicepsFlexed className="icon" />,
      url: "/dashboard/body-parts",
    },

    {
      title: "Racks",
      icon: <Rows3 className="icon" />,
      url: "/dashboard/racks",
    },
    {
      title: "YouTube Videos",
      icon: <Play className="icon" />,
      baseUrl: "/dashboard/exercise",
      submenu: [
        {
          title: "Exercise Library",
          url: "/dashboard/exercise-library",
        },
        {
          title: "Exercise Setup ",
          url: "/dashboard/exercise-setup",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   icon: <Settings className="icon" />,
    //   url: "/dashboard/settings",
    // },
  ];

  return (
    <nav className="grow space-y-1.5 overflow-y-auto p-6">
      {menuList.map((menu, index) => {
        if (menu.submenu) {
          return (
            <MenuCollapsible key={index} {...menu}>
              {menu.submenu.map((submenu, index) => (
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
