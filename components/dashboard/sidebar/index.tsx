import SidebarMenu from "./menu";

const Sidebar = () => {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border dark:bg-slate-900">
      <SidebarMenu />
    </aside>
  );
};

export default Sidebar;
