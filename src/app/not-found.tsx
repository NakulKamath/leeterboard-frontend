'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NotFoundPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      router.push('/');
    }

    return () => clearInterval(interval);
  }, [countdown, router]);

  useEffect(() => {
    toast.error('Page not found');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="pt-25 md:pt-0 text-5xl md:text-9xl text-center tracking-tight">leeterboard.xyz</h1>
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-2">Redirecting to home in {countdown}...</p>
    </div>
  );
}