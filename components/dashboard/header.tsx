"use client";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Button } from "@/components/ui/button";
import { ChevronDown, Home, LogOut, Menu, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/providers/sidebar-provider";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { data: session, isPending } = useSession();
  const router = useRouter();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <Button onClick={toggleSidebar} size="icon" variant="secondary">
          <Menu />
        </Button>
        <Button variant="secondary" className="hidden sm:inline-flex" asChild>
          <Link href="/">
            <Home />
            <span>Visit Front Page</span>
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {isPending || !session ? (
          <div className="flex items-center gap-2">
            <Skeleton className="aspect-square size-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent"
              >
                <Avatar>
                  <AvatarImage
                    src="https://i.pravatar.cc/40?img=12"
                    alt="Profile image"
                  />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
                <span className="max-w-52 truncate text-lg">
                  {session?.user.name}
                </span>
                <ChevronDown className="opacity-60" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-64">
              <DropdownMenuLabel className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {session?.user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserRound aria-hidden="true" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/auth/sign-in");
                          router.refresh();
                        },
                      },
                    });
                  }}
                >
                  <LogOut aria-hidden="true" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
