"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Menu, X, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/src/assets/logo-icon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAnimationDuration } from "@/src/lib/utils/reduced-motion";

interface HeroProps {
  titleLine1?: string;
  titleHighlight?: string;
  titleLine2?: string;
  subtitle?: string;
  primaryActionText?: string;
  primaryActionHref?: string;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  socialProofText?: string;
  backgroundImage?: string;
}

const navLinks = [
  { label: "Fan Assistant", href: "/fan" },
  { label: "Operations", href: "/operations" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "About", href: "/about" },
];

const PLACEHOLDER_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
];

export default function Hero({
  titleLine1 = "AI-Powered",
  titleHighlight = "Stadium",
  titleLine2 = "Intelligence for FIFA 2026",
  subtitle = "Enhance fan experience, optimize operations, and empower volunteers with real-time AI insights for the world's biggest sporting event.",
  primaryActionText = "Try Fan Assistant",
  primaryActionHref = "/fan",
  secondaryActionText = "View Operations",
  secondaryActionHref = "/operations",
  socialProofText = "Trusted by 200+ stadiums worldwide",
  backgroundImage = "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2852&auto=format&fit=crop",
}: HeroProps) {
  const [activeNav, setActiveNav] = useState("Fan Assistant");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-[#F5F3EE]" aria-labelledby="main-heading">
      {/* Background Image with subtle overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-[#F5F3EE]/90 via-[#F5F3EE]/70 to-[#F5F3EE]/95" aria-hidden="true" />

      {/* Floating Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: getAnimationDuration(0.6), ease: "easeOut" }}
        className="relative z-50 mt-6 flex h-16 w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-2xl bg-white/90 px-4 shadow-[0_2px_20px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-6"
        role="banner"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <LogoIcon className="size-8 text-orange-500" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            StadiumOS
          </span>
        </div>

        {/* Right Actions */}
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
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
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
                    setActiveNav(link.label);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    activeNav === link.label
                      ? "bg-orange-50 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  aria-current={activeNav === link.label ? "page" : undefined}
                >
                  {link.label}
                </button>
              ))}
              <Button
                size="sm"
                className="mt-2 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                aria-label="Get started with StadiumOS"
              >
                Get Started
              </Button>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container flex flex-1 flex-col items-center justify-center px-4 pb-20 text-center md:pb-32" role="main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center"
        >
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: getAnimationDuration(0.6), delay: 0.2 }}
            className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
            aria-label="User testimonials"
          >
            <div className="flex -space-x-2">
              {PLACEHOLDER_AVATARS.map((avatar, index) => (
                <div
                  key={index}
                  className="relative size-10 rounded-full border-2 border-white ring-2 ring-orange-500/20"
                >
                  <Image
                    src={avatar}
                    alt={`User avatar ${index + 1}`}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-1 text-orange-500" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <span className="mt-0.5 text-sm font-medium text-gray-700">
                {socialProofText}
              </span>
            </div>
          </motion.div>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.3 }}
            className="mb-6 text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
            id="main-heading"
          >
            {titleLine1}{" "}
            <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {titleHighlight}
            </span>
            <br />
            <span className="text-gray-800">{titleLine2}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.4 }}
            className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl"
            id="main-description"
          >
            {subtitle}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.5 }}
            className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-4"
            role="group"
            aria-label="Main actions"
          >
            <Button
              size="lg"
              className="h-14 w-full rounded-xl bg-orange-500 px-8 text-base font-medium text-white shadow-[0_4px_20px_rgba(249,115,22,0.35)] cursor-pointer transition-all hover:bg-orange-600 hover:shadow-[0_6px_30px_rgba(249,115,22,0.45)] sm:w-auto"
              onClick={() => router.push(primaryActionHref)}
              aria-describedby="main-description"
            >
              {primaryActionText}
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white/80 px-8 text-base font-medium text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-gray-900 sm:w-auto"
              onClick={() => router.push(secondaryActionHref)}
            >
              {secondaryActionText}
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
            role="list"
            aria-label="Key features"
          >
            {[
              "Real-time AI",
              "Smart Navigation",
              "Crowd Insights",
              "Accessibility",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-white/70 px-4 py-1.5 text-xs font-medium text-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm"
                role="listitem"
              >
                {feature}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: getAnimationDuration(0.6), delay: 0.8, ease: "easeOut" }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-gray-500"
        aria-hidden="true"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
