import { Dumbbell, LayoutGrid, Settings, UsersRound } from "lucide-react";
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
      title: "Users",
      icon: <UsersRound className="icon" />,
      baseUrl: "/dashboard/users",
      submenu: [
        {
          title: "All Users",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Equipments",
      icon: <Dumbbell className="icon" />,
      url: "/dashboard/equipments",
    },
    {
      title: "Body Parts",
      icon: <Dumbbell className="icon" />,
      url: "/dashboard/body-parts",
    },
    {
      title: "Settings",
      icon: <Settings className="icon" />,
      url: "/dashboard/settings",
    },
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
