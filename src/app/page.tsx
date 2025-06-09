'use client'

import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useState, useEffect } from "react";
import Topnav from "@/components/Topnav";

export default function Home() {
  if (typeof document !== 'undefined') {
    document.title = "leeterboard.xyz";
  }
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1000);
    return () => clearTimeout(timer);
  }, []);


  const { userLoggedIn } = useAuth();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0"><Topnav /></div>
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
      <div className="flex flex-row gap-8 items-center justify-center h-full">
        <div className="hidden 2xl:block"><Grid size="100" speed={2.5} color="#ffa41d" /></div>
        <div className="hidden xl:block"><Grid size="150" speed={3} color="#ffa41d" /></div>
        <div className="hidden lg:block"><Grid size="200" speed={3.5} color="#ffa41d" /></div>
        <div className="hidden sm:block"><Grid size="250" speed={4} color="#ffa41d" /></div>
        <Grid size="300" speed={5} color="#ffa41d" />
        <div style={{ transform: "scaleX(-1)" }} className="hidden sm:block"><Grid size="250" speed={4} color="#ffa41d" /></div>
        <div style={{ transform: "scaleX(-1)" }} className="hidden lg:block"><Grid size="200" speed={3.5} color="#ffa41d" /></div>
        <div style={{ transform: "scaleX(-1)" }} className="hidden xl:block"><Grid size="150" speed={3} color="#ffa41d" /></div>
        <div style={{ transform: "scaleX(-1)" }} className="hidden 2xl:block"><Grid size="100" speed={2.5} color="#ffa41d" /></div>
      </div>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6 items-center z-10">
      <h1 className="pt-25 md:pt-0 text-5xl md:text-9xl text-center tracking-tight">leeterboard.xyz</h1>
      <p className="text-lg md:text-2xl text-center font-light">Leetcode Leaderboards</p>
      {(() => {
        return (
          <div
        className={`md:absolute md:bottom-20 flex gap-4 mt-4 transition-all duration-700 ${
          showButtons
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
        style={{ willChange: "opacity, transform" }}
          >
        {userLoggedIn ? (
          <Link
            href="/dashboard"
            className="px-24 py-2 md:px-48 md:py-4 rounded bg-[#ffa41d] text-white font-semibold hover:bg-[#ffb84d] transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
          href="/sign-up"
          className="px-12 py-2 md:px-24 md:py-4 rounded bg-[#ffa41d] text-white font-semibold hover:bg-[#ffb84d] transition"
            >
          Sign Up
            </Link>
            <Link
          href="/sign-in"
          className="px-12 py-2 md:px-24 md:py-4 rounded border border-[#ffa41d] text-[#ffa41d] font-semibold hover:bg-[#fff7e6] transition"
            >
          Sign In
            </Link>
          </>
        )}
          </div>
        );
      })()}
      </div>
    </div>
  );
}
