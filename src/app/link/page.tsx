"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from '@/components/AuthContext';
import { Loader } from "@/components/Loader";

const LinkPage = () => {
  const { user, userLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (!userLoggedIn) {
        toast.error("You must be logged in to access this page.");
        console.log(!!user)
        console.log(user)
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, userLoggedIn]);

  if (loading) {
    return (
      <Loader />
    )
  }

  if (!userLoggedIn) {
    return null;
  }

  return <div>Welcome to the Link Page!</div>;
}

export default LinkPage;