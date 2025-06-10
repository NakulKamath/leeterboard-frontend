"use client";

import { LeeterboardLogo } from "@/components/LeeterboardLogo";
import Link from "next/link";
import { LinkerForm } from "@/components/linker-form";

const LinkerPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden">
      <div className="flex w-full max-w-sm flex-col gap-6 pb-[10vh]">
          <Link href="/" className="flex items-center gap-2 self-center font-medium">
            <LeeterboardLogo />
          </Link>
          <LinkerForm/>
      </div>
    </div>
  );
}

export default LinkerPage;