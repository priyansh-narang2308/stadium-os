"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAnimationDuration } from "@/src/lib/utils/reduced-motion";
import { FloatingNav } from "@/src/components/layout/floating-nav";
import { SocialProof } from "@/src/components/ui/social-proof";
import { FeaturePills } from "@/src/components/ui/feature-pills";

const DEFAULT_BG = "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2852&auto=format&fit=crop";

export default function Hero() {
  const [activeNav, setActiveNav] = useState("Fan Assistant");
  const router = useRouter();

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-[#F5F3EE]" aria-labelledby="main-heading">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url(${DEFAULT_BG})` }} aria-hidden="true" />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-[#F5F3EE]/90 via-[#F5F3EE]/70 to-[#F5F3EE]/95" aria-hidden="true" />

      <FloatingNav activeLabel={activeNav} onNavigate={setActiveNav} />

      <main className="relative z-10 container flex flex-1 flex-col items-center justify-center px-4 pb-20 text-center md:pb-32" role="main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: getAnimationDuration(0.6), delay: 0.2 }}
          >
            <SocialProof />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.3 }}
            className="mb-6 text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
            id="main-heading"
          >
            AI-Powered{" "}
            <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Stadium
            </span>
            <br />
            <span className="text-gray-800">Intelligence for FIFA 2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.4 }}
            className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl"
            id="main-description"
          >
            Enhance fan experience, optimize operations, and empower volunteers with real-time AI insights for the worlds biggest sporting event.
          </motion.p>

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
              onClick={() => router.push("/fan")}
              aria-describedby="main-description"
            >
              Try Fan Assistant
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white/80 px-8 text-base font-medium text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-gray-900 sm:w-auto"
              onClick={() => router.push("/operations")}
            >
              View Operations
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getAnimationDuration(0.8), delay: 0.6 }}
          >
            <FeaturePills />
          </motion.div>
        </motion.div>
      </main>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: getAnimationDuration(0.6), delay: 0.8, ease: "easeOut" }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-gray-500"
        aria-hidden="true"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
