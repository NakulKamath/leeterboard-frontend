import { useState, useEffect } from 'react';

export function LeeterboardLogo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-[#ffa41d] text-primary-foreground flex size-6 items-center justify-center rounded-md w-40">
      leeterboard.xyz
    </div>
  );
}
