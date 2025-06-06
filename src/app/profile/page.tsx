"use client";

import { useAuth } from '@/components/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>This is the profile page content.</p>
    </div>
  );
}
export default ProfilePage;