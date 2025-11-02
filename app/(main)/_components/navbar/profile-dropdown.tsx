"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth-client";
import { useProgress } from "@bprogress/next";
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  Trophy,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSessionWithPermissions } from "@/hooks/useSessionWithPermissions";

type Session = typeof auth.$Infer.Session | null;

export const ProfileDropdown = ({ session: serverSession }: { session: Session }) => {
  const router = useRouter();
  const { start, stop } = useProgress();
  
  // Use client-side session which includes permissions
  const { data: clientSession } = useSessionWithPermissions();
  const session = clientSession || serverSession;
  
  // Check if user can access dashboard (has any management permission)
  const canAccessDashboard = (): boolean => {
    if (!session?.user) return false;
    if (session.user.role === "admin") return true;
    
    // Check if user has any LIST/VIEW permission from major sections
    const user = session.user as any;
    const permissions = user.permissions || [];
    
    return permissions.some((p: any) => 
      (p.action === "list" || p.action === "view") &&
      (
        p.resource === "user" ||
        p.resource === "role" ||
        p.resource === "demoCenter" ||
        p.resource === "equipment" ||
        p.resource === "bodyPart" ||
        p.resource === "rack" ||
        p.resource === "exerciseLibrary" ||
        p.resource === "exerciseSetup" ||
        p.resource === "points" ||
        p.resource === "contest" ||
        p.resource === "feedback" ||
        p.resource === "system"
      )
    );
  };
  
  const showDashboard = canAccessDashboard();

  // Handle sign-out & progressbar
  const handleSignout = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          start();
        },
        onSuccess: () => {
          router.refresh();
          stop();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          stop();
        },
      },
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src="" alt="Profile image" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-base xs:block">
            {session?.user.name}
          </span>
          <ChevronDown className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{session?.user.name}</span>
          <span className="truncate text-sm font-medium text-muted-foreground">
            {session?.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {showDashboard && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutGrid aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          {session && (
            <DropdownMenuItem asChild>
              <Link href="/leaderboard">
                <Trophy aria-hidden="true" />
                <span>Leaderboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserRound aria-hidden="true" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignout}>
            <LogOut aria-hidden="true" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
