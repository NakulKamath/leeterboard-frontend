'use client'

import React from "react";
import GroupAPI from "@/api/group";
import UserCard from "@/components/UserCard";
import { UserType, GroupType } from "@/components/Types";
import { doSignOut } from "@/components/FirebaseAuth";

export default function Home() {
  const [members, setMembers] = React.useState<UserType[]>([]);

  React.useEffect(() => {
    GroupAPI.getGroup("test").then((res: GroupType) => {
      if (res && Array.isArray(res.members)) {
        setMembers(res.members);
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await doSignOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main>
      <button
        onClick={handleSignOut}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Sign Out
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {members.map((member, idx) => (
          <UserCard key={member.username || idx} {...member} />
        ))}
      </div>
    </main>
  );
}
