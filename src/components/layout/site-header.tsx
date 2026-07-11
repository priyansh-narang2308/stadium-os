"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
            aria-label="StadiumOS AI Home"
          >
            <Trophy className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold">StadiumOS AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
            >
              Home
            </Link>
            <Link
              href="/fan"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
            >
              Fan Assistant
            </Link>
            <Link
              href="/operations"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
            >
              Operations
            </Link>
            <Link
              href="/volunteer"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
            >
              Volunteer
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden mt-4 pb-2 flex flex-col gap-4"
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/fan"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Fan Assistant
            </Link>
            <Link
              href="/operations"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Operations
            </Link>
            <Link
              href="/volunteer"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Volunteer
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
