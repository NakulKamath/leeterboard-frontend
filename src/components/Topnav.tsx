'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { GroupSelector } from "./GroupSelector";

function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Topnav: React.FC = () => {
  const pathname = usePathname();
  const path = pathname.split("?")[0]; // Remove query params
  const segments = path.split("/").filter(Boolean);
  const isRoot = segments.length === 0;
  const lastSegment = segments[segments.length - 1] || "";
  const { userLoggedIn } = useAuth();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1000);
    return () => clearTimeout(timer);
  }, []);



  return (
    <div className="h-[8vh] bg-muted w-[100vw] py-4 px-6 flex items-center overflow-hidden relative z-10">
      <div className="flex items-center flex-1">
      <Link
        href="/"
        className={`text-white text-lg font-semibold transition-opacity ${
        isRoot ? "opacity-100" : "opacity-50 hover:opacity-100"
        } hidden sm:block`}
      >
        leeterboard.xyz
      </Link>
      <Link
        href="/"
        className={`text-white text-lg font-semibold transition-opacity ${
        isRoot ? "opacity-100" : "opacity-50 hover:opacity-100"
        } block sm:hidden`}
      >
        lb
      </Link>
      {!isRoot && (
        <>
        <span className="mx-2 text-white/50">/</span>
        <span className="text-white text-lg font-semibold opacity-100">
          {capitalize(lastSegment)}
        </span>
        </>
      )}
      </div>
      <div className="flex items-center gap-2 ml-auto"></div>
      <div
      className={`flex gap-2 transition-all duration-700 ${
        showButtons
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-8 pointer-events-none"
      }`}
      style={{ willChange: "opacity, transform" }}
      >
      {userLoggedIn ? (
        <>
          <GroupSelector />
          <Link
          href="/dashboard"
          className="px-4 py-1 rounded bg-[#ffa41d] text-white font-semibold hover:bg-[#ffb84d] transition"
          >
          Dashboard
          </Link>
        </>
      ) : (
        <>
        <Link
          href="/sign-up"
          className="px-3 py-1 rounded bg-[#ffa41d] text-white font-semibold hover:bg-[#ffb84d] transition"
        >
          Sign Up
        </Link>
        <Link
          href="/sign-in"
          className="px-3 py-1 rounded border border-[#ffa41d] text-[#ffa41d] font-semibold hover:bg-[#fff7e6] transition"
        >
          Sign In
        </Link>
        </>
      )}
      </div>
    </div>
  );
};

export default Topnav;