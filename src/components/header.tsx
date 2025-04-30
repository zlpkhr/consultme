"use client";

import { Button } from "@/components/ui/button";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  const scrolled = useScroll(15);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = () => setOpen(false);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange();
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <header
      className={cn(
        "animate-slide-down-fade fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        open ? "h-52" : "h-16",
        scrolled || open
          ? "backdrop-blur-nav max-w-3xl border-gray-100 bg-white/80 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-black"
          : "bg-white/0 dark:bg-gray-950/0"
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <span className="sr-only">Company logo</span>
            <p className="w-28 font-bold md:w-32">WAYIN</p>
          </Link>
          <nav className="hidden md:absolute md:top-1/2 md:left-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2">
            <div className="flex items-center gap-10 font-medium"></div>
          </nav>
          <div className="hidden h-10 font-semibold md:flex">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <Link href="/signin">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
          <div className="flex gap-x-2 md:hidden">
            <Button
              onClick={() => setOpen(!open)}
              className="ml-2 aspect-square p-2"
            >
              {open ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          className={cn(
            "my-6 flex text-lg ease-in-out will-change-transform md:hidden",
            open ? "" : "hidden"
          )}
        >
          <ul className="space-y-4 font-medium">
            <li>
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2"
                asChild
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
