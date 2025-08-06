"use client";

import { motion } from "motion/react";
import { GoogleGeminiEffectDemo } from "./_components/GeminiEffectDemo";
import { LampFooterLandingPage } from "./_components/LampFooterLandingPage";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { WatchVideoButton } from "./_components/WatchVideoButton";

export default function HeroSectionOne() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"🗣️ Natural Conversations. Clinical Precision 🩺"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Mediecho is your AI-powered medical voice assistant that speaks like a
          real doctor. It listens carefully, asks the right follow-up questions,
          and responds with clinical expertise—so patients feel heard,
          understood, and supported, 24/7.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href={"/sign-in"}>
            <button className="w-60 cursor-pointer transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get Started
            </button>
          </Link>
          {/* ▶️ Watch Video Button */}
          <WatchVideoButton />
        </motion.div>
        {/* <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="https://assets.aceternity.com/pro/aceternity-landing.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div> */}
      </div>

      <GoogleGeminiEffectDemo />

      <div className="w-[100%]">
        <LampFooterLandingPage />
      </div>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full shadow-md items-center justify-between border-t border-b border-neutral-200 px-5 py-5 dark:border-neutral-800">
      <Link href={"/"}>
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-600 animate-spin" />
          <h1 className="text-base font-bold md:text-2xl">Mediecho AI</h1>
        </div>
      </Link>
      {!user ? (
        <Link href={"/sign-in"}>
          <button className="w-24 cursor-pointer transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-5">
          <div className="hidden md:block">
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
          <Link href={"/dashboard"}>
            <button className="group cursor-pointer relative w-full sm:w-40 overflow-hidden rounded-xl bg-slate-950 px-4 sm:px-6 py-2 text-center text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-slate-500/50 dark:text-white text-sm sm:text-base">
              {/* Background gloss layer */}
              <span className="absolute inset-0 z-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></span>

              {/* Fancy border glow on hover */}
              <span className="absolute -inset-1 z-0 rounded-xl bg-gradient-to-br from-slate-400/40 via-slate-500/30 to-transparent opacity-0 blur-md transition-all duration-500 group-hover:opacity-100"></span>

              {/* Text on top */}
              <span className="relative z-10 tracking-wide">Dashboard</span>
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};
