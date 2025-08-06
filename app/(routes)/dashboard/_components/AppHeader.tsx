"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, Zap } from "lucide-react";
import axios from "axios";
import { usePathname } from "next/navigation";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const menuOptions = [
  { id: 1, name: "Dashboard", path: "/dashboard" },
  { id: 2, name: "History", path: "/dashboard/history" },
  { id: 3, name: "Subscription", path: "/dashboard/subscription" },
];

const AppHeader = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard"; // exact match
    return pathname.startsWith(path); // match subroutes
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get("/api/users");
        setCredits(res.data.credits);
      } catch (err) {
        console.error("Failed to fetch credits", err);
        setCredits(0);
      }
    };
    fetchCredits();

    // 👇 Listen for credit update event
    const handleCreditsUpdate = () => fetchCredits();
    window.addEventListener("creditsUpdated", handleCreditsUpdate);

    return () => {
      window.removeEventListener("creditsUpdated", handleCreditsUpdate);
    };
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex w-full items-center justify-between border-y border-neutral-200 px-5 py-5 shadow-md dark:border-neutral-800">
        {/* Left - Logo */}
        <Link href={'/'}>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="size-7 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-600 animate-spin" />
          <h1 className="text-base font-bold md:text-2xl">Mediecho AI</h1>
        </div>
        </Link>

        {/* Center - Menu */}
        <nav className="flex-1 flex justify-center items-center gap-8">
          {menuOptions.map((option) => (
            <Link key={option.id} href={option.path}>
              <h2
                className={cn(
                  "font-medium text-sm md:text-base cursor-pointer transition-all duration-200 hover:text-emerald-500",
                  isActive(option.path)
                    ? "text-emerald-600 font-bold underline underline-offset-4"
                    : ""
                )}
              >
                {option.name}
              </h2>
            </Link>
          ))}
        </nav>

        {/* Right - Credits + UserButton */}
        <div className="flex items-center gap-4 mr-1">
          {credits !== null && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-400 dark:text-yellow-300 hover:scale-[1.05] transition-transform cursor-pointer group">
                  <Zap className="w-4 h-4 text-orange-500 fill-yellow-400 group-hover:animate-pulse" />
                  <span className="group-hover:underline">{credits}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="center"
                className="w-64 p-4 rounded-xl shadow-xl border border-yellow-300 dark:border-yellow-500 bg-gradient-to-br from-emerald-100 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 text-sm font-medium text-yellow-900 dark:text-yellow-100"
              >
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500 fill-yellow-400" />
                    <span className="font-semibold text-yellow-700 dark:text-yellow-100">
                      {credits} credit{credits !== 1 ? "s" : ""} available
                    </span>
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">
                    Each medical consultation uses <strong>1 credit</strong>.
                    Subscribe for more AI support.
                  </p>
                  <Link href={"/dashboard/subscription"}>
                    <button className="cursor-pointer mt-2 w-full py-1.5 text-xs rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-inner transition-colors">
                      Buy Subscription
                    </button>
                  </Link>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "40px",
                  height: "40px",
                },
              },
            }}
          />
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-5 py-4 border-b border-neutral-200 shadow-md dark:border-neutral-800">
        <Link href={'/'}>
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-600 animate-spin" />
          <h1 className="text-base font-bold">Mediecho AI</h1>
        </div>
        </Link>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowMobileMenu((prev) => !prev)}>
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200 cursor-pointer" />
          </button>

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "40px",
                  height: "40px",
                },
              },
            }}
          />
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div className="absolute top-[70px] right-5 mt-2 w-48 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-50 flex flex-col p-2 md:hidden">
          {menuOptions.map((option) => (
            <Link key={option.id} href={option.path}>
              <span
                onClick={() => setShowMobileMenu(false)}
                className={cn(
                  "block px-4 py-2 text-sm rounded transition-all",
                  isActive(option.path)
                    ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-white font-bold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800"
                )}
              >
                {option.name}
              </span>
            </Link>
          ))}

          {/* Credits */}
          <div className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-emerald-50 dark:bg-emerald-900 rounded flex items-center gap-2">
            {credits !== null && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-400 dark:text-yellow-300 active:scale-[0.97] transition-transform cursor-pointer group">
                    <Zap className="w-4 h-4 text-orange-500 fill-yellow-400 group-active:animate-ping" />
                    <span className="group-active:underline">
                      {credits} credits
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  side="bottom"
                  className="w-72 p-4 rounded-xl shadow-xl border border-yellow-300 dark:border-yellow-500 bg-gradient-to-br from-emerald-100 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 text-sm font-medium text-yellow-900 dark:text-yellow-100"
                >
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500 fill-yellow-400" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-100">
                        {credits} credit{credits !== 1 ? "s" : ""} available
                      </span>
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-300">
                      Each medical consultation uses <strong>1 credit</strong>.
                      Subscribe for more AI support.
                    </p>
                    <Link href="/dashboard/subscription">
                      <button className="cursor-pointer mt-2 w-full py-1.5 text-xs rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-inner transition-colors">
                        Buy Subscription
                      </button>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
