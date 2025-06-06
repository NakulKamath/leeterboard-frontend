"use client";

import { SignupForm } from "@/components/signup-form";
import { LeeterboardLogo } from "@/components/LeeterboardLogo";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 pb-[10vh]">
          <Link href="/" className="flex items-center gap-2 self-center font-medium">
            <LeeterboardLogo />
          </Link>
          <SignupForm />
      </div>
    </div>
  );
}

export default SignUpPage;