"use client";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useProgress } from "@bprogress/next";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileDropdown } from "./profile-dropdown";

const Navbar = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { start, stop } = useProgress();
  const router = useRouter();
  // Navigation Links
  const menuList = [
    {
      title: "EXERCISE LIBRARY",
      url: "/",
    },
    {
      title: "EXERCISE SETUP",
      url: "/exerciseSetup",
    },
    {
      title: "DEMO/RETAIL CENTERS",
      baseUrl: "/demoCenters",
      submenu: [
        {
          title: "DEMO CENTER",
          url: "/demoCenters",
        },
        // {
        //   title: "RETAIL CENTER",
        //   url: "/demo-retail-centers/retail-center",
        // },
        {
          title: "DEMO CENTER FORM",
          url: "/demoCenterForm",
        },
      ],
    },
    {
      title: "UPLOAD VIDEO",
      url: "/uploadVideo",
    },
  ];
  const handleSignoutMobile = async () => {
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

  const handleDropdownToggle = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleDropdownOpen = (title: string) => {
    setOpenDropdown(title);
  };

  const handleDropdownMouseLeave = () => {
    setTimeout(() => {
      setOpenDropdown(null);
    }, 100);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 h-16 border-b border-border bg-white py-3 dark:bg-card">
        <div className="container flex items-center justify-between gap-2">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Brand Logo"
              width={100}
              height={70}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-between gap-2 md:flex">
            <div className="flex items-center gap-[2px]">
              {menuList.map((menu, index) => {
                const isActive = menu.url
                  ? pathname === menu.url
                  : pathname.startsWith(menu.baseUrl || "");
                const isDropdownOpen = openDropdown === menu.title;

                return (
                  <div key={index} className="flex items-center">
                    {index > 0 && <div className="mx-3 h-4 w-px bg-border" />}
                    <div className="relative">
                      {menu.submenu ? (
                        // Dropdown Menu Item
                        <div className="relative">
                          <button
                            onMouseEnter={() => handleDropdownOpen(menu.title)}
                            className={cn(
                              "flex items-center gap-2 border-b-2 border-transparent py-2 text-sm font-medium transition-colors hover:text-black focus:outline-none",
                              {
                                "border-b-black text-black": isActive,
                                "text-muted-foreground": !isActive,
                              },
                            )}
                          >
                            {menu.title}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-2xl transition-transform duration-200",
                                isDropdownOpen && "rotate-180",
                              )}
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <div
                              className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-md border bg-popover p-1 shadow-lg"
                              onMouseEnter={() =>
                                handleDropdownOpen(menu.title)
                              }
                              onMouseLeave={handleDropdownMouseLeave}
                            >
                              {menu.submenu.map((submenu, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={submenu.url}
                                  className={cn(
                                    "block w-full rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === submenu.url &&
                                      "bg-accent text-accent-foreground",
                                  )}
                                  onClick={handleDropdownClose}
                                >
                                  {submenu.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Regular Menu Item
                        <Link
                          href={menu.url!}
                          className={cn(
                            "border-b-2 border-transparent px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none",
                            {
                              "border-b-primary text-primary": isActive,
                              "text-muted-foreground": !isActive,
                            },
                          )}
                        >
                          {menu.title}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {session ? (
                <ProfileDropdown session={session} />
              ) : (
                <Button asChild>
                  <Link href="/auth/sign-in">LOGIN/CREATE ACCOUNT</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {session && <ProfileDropdown session={session} />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeMobileMenu}
        />

        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col p-6">
            {/* Mobile Navigation Menu */}
            <nav className="space-y-4">
              {menuList.map((menu, index) => {
                const isActive = menu.url
                  ? pathname === menu.url
                  : pathname.startsWith(menu.baseUrl || "");
                const isDropdownOpen = openDropdown === menu.title;

                return (
                  <div key={index} className="space-y-2">
                    {menu.submenu ? (
                      // Mobile Dropdown Menu Item
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(menu.title)}
                          className={cn(
                            "flex w-full items-center justify-between border-b-2 border-transparent py-3 text-left text-sm font-medium transition-colors",
                            {
                              "border-b-primary text-primary": isActive,
                              "text-muted-foreground": !isActive,
                            },
                          )}
                        >
                          {menu.title}
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 transition-transform duration-200",
                              isDropdownOpen && "rotate-180",
                            )}
                          />
                        </button>

                        {/* Mobile Dropdown Content */}
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isDropdownOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0",
                          )}
                        >
                          <div className="ml-4 space-y-2 border-l pt-2 pl-4">
                            {menu.submenu.map((submenu, subIndex) => (
                              <Link
                                key={subIndex}
                                href={submenu.url}
                                className={cn(
                                  "block py-2 text-sm transition-colors hover:text-primary",
                                  pathname === submenu.url
                                    ? "text-primary"
                                    : "text-muted-foreground",
                                )}
                                onClick={closeMobileMenu}
                              >
                                {submenu.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Mobile Regular Menu Item
                      <Link
                        href={menu.url!}
                        className={cn(
                          "block border-b-2 border-transparent py-3 text-sm font-medium transition-colors",
                          {
                            "border-b-primary text-primary": isActive,
                            "text-muted-foreground": !isActive,
                          },
                        )}
                        onClick={closeMobileMenu}
                      >
                        {menu.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Mobile Auth Section */}
            <div className="mt-8 border-t pt-6">
              {session ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Signed in as {session.user.email}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSignoutMobile}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/auth/sign-in" onClick={closeMobileMenu}>
                    LOGIN/CREATE ACCOUNT
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
