'use client'

import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
      <div className="flex flex-row gap-8 items-center justify-center h-full">
        <Grid size="100" speed={2.5} color="#ffa41d" />
        <Grid size="150" speed={3} color="#ffa41d" />
        <Grid size="200" speed={3.5} color="#ffa41d" />
        <Grid size="250" speed={4} color="#ffa41d" />
        <Grid size="300" speed={5} color="#ffa41d" />
        <div style={{ transform: "scaleX(-1)" }}><Grid size="250" speed={4} color="#ffa41d" /></div>
        <div style={{ transform: "scaleX(-1)" }}><Grid size="200" speed={3.5} color="#ffa41d" /></div>
        <div style={{ transform: "scaleX(-1)" }}><Grid size="150" speed={3} color="#ffa41d" /></div>
        <div style={{ transform: "scaleX(-1)" }}><Grid size="100" speed={2.5} color="#ffa41d" /></div>
      </div>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6 items-center z-10">
      <h1 className="pt-25 md:pt-0 text-5xl md:text-9xl text-center tracking-tight">leeterboard.xyz</h1>
      <p className="text-lg md:text-2xl text-center font-light">Leetcode Leaderboards</p>
      <div className="md:absolute md:bottom-20 flex gap-4 mt-4">
        <Link href="/sign-up" className="px-12 py-2 md:px-24 md:py-4 rounded bg-[#ffa41d] text-white font-semibold hover:bg-[#ffb84d] transition">Sign Up</Link>
        <Link href="/sign-in" className="px-12 py-2 md:px-24 md:py-4 rounded border border-[#ffa41d] text-[#ffa41d] font-semibold hover:bg-[#fff7e6] transition">Sign In</Link>
      </div>
      </div>
    </div>
  );
}
