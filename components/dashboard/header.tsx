import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6 dark:bg-slate-900">
      <Button size="icon" variant="secondary">
        <Menu className="size-5" />
      </Button>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
