"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/src/assets/logo-icon";
import { getAnimationDuration } from "@/src/lib/utils/reduced-motion";

const navLinks = [
  { label: "Fan Assistant", href: "/fan" },
  { label: "Operations", href: "/operations" },
  { label: "Volunteer", href: "/volunteer" },
];

interface FloatingNavProps {
  activeLabel?: string;
  onNavigate?: (label: string) => void;
}

export function FloatingNav({ activeLabel, onNavigate }: FloatingNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: getAnimationDuration(0.6), ease: "easeOut" }}
      className="relative z-50 mt-6 flex h-16 w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-2xl bg-white/90 px-4 shadow-[0_2px_20px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-6"
      role="banner"
    >
      <div className="flex items-center gap-2">
        <LogoIcon className="size-8 text-orange-500" aria-hidden="true" />
        <span className="text-lg font-semibold tracking-tight text-gray-900">StadiumOS</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          size="sm"
          className="hidden h-9 rounded-xl bg-orange-500 px-4 text-sm font-medium text-white shadow-[0_2px_10px_rgba(249,115,22,0.3)] transition-all hover:bg-orange-600 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] sm:flex"
          aria-label="Get started with StadiumOS"
        >
          Get Started
        </Button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex size-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: getAnimationDuration(0.6) }}
          id="mobile-navigation"
          className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-2xl bg-white/95 shadow-xl backdrop-blur-md md:hidden"
          role="navigation"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col p-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigate?.(link.label);
                  setIsMobileMenuOpen(false);
                }}
                className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  activeLabel === link.label
                    ? "bg-orange-50 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                aria-current={activeLabel === link.label ? "page" : undefined}
              >
                {link.label}
              </button>
            ))}
            <Button size="sm" className="mt-2 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600" aria-label="Get started with StadiumOS">
              Get Started
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
