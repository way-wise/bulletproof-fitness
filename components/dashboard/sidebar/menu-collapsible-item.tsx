import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

type MenuCollapsibleItemProps = {
  title: string;
  url: string;
};

const MenuCollapsibleItem = ({ title, url }: MenuCollapsibleItemProps) => {
  const pathName = usePathname();
  const active = pathName === url;

  return (
    <Link
      href={url}
      className="relative flex items-center before:h-px before:w-[1.6rem] before:bg-border before:transition-colors before:content-[''] focus-visible:outline-hidden"
    >
      <span
        className={cn(
          "w-full rounded-sm px-2.5 py-1 font-medium transition-colors",
          {
            "bg-secondary": active,
            "text-secondary-foreground/70 hover:bg-secondary": !active,
          },
        )}
      >
        {title}
      </span>
    </Link>
  );
};

export default MenuCollapsibleItem;
