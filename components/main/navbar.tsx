"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { signOut, useSession } from "@/lib/auth-client";
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
import { ChevronDown, LayoutGrid, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  return (
    <nav className="border-b border-border py-3 dark:bg-zinc-900">
      <div className="container flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold">
          Logo
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {isPending ? (
            <div className="flex items-center gap-2">
              <Skeleton className="aspect-square size-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ) : session ? (
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
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutGrid aria-hidden="true" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserRound aria-hidden="true" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut({
                        fetchOptions: {
                          onSuccess: () => {
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
          ) : (
            <Button asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
