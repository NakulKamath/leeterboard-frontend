"use client";

import { useAuth } from '@/components/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader } from '@/components/Loader';
import Link from 'next/link';
import UserAPI from '@/api/user';
import GroupAPI from '@/api/group';
import { Progress } from "@/components/ui/progress";
import { SettingsDrawer } from '@/components/SettingsDrawer';
import CreateDialog from '@/components/CreateDialog';
import DeleteDialog from '@/components/DeleteDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { doSignOut } from '@/components/FirebaseAuth';
import { Dialog,DialogClose, DialogContent, DialogDescription, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Share } from 'lucide-react';

interface UserProfile {
  username: string;
  userAvatar: string;
  groups: string[];
  owned: [string, { members: string[]; secret: string; privacy: boolean }][];
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loaderState, setLoaderState] = useState<boolean>(true);
  const [isPrivacyLoading, setIsPrivacyLoading] = useState<boolean>(false);
  const [groupName, setGroupName] = useState("");
  const [groupSecret, setGroupSecret] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);

  if (typeof document !== 'undefined') {
    document.title = "Dashboard";
  }

  const createHandler = async () => {
    setIsLoading(true);
    if (!groupName || !groupSecret) {
      toast.error("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    try {
      const trimmedGroupName = groupName.trim();
      const trimmedGroupSecret = groupSecret.trim();
      
      setGroupName(trimmedGroupName);
      setGroupSecret(trimmedGroupSecret);
      
      if (/[^a-zA-Z0-9_-]/.test(trimmedGroupName)) {
        toast.error("Group name can only contain letters, numbers, underscores, and hyphens.");
        setIsLoading(false);
        return;
      }
      if (/[^a-zA-Z0-9_-]/.test(trimmedGroupSecret)) {
        toast.error("Group secret can only contain letters, numbers, underscores, and hyphens.");
        setIsLoading(false);
        return;
      }

      const response = await GroupAPI.createGroup(trimmedGroupName, trimmedGroupSecret, isPrivate, user?.uid || "");
      if (!response.success) {
        toast.error("Failed to create group: " + response.message);
      } else {
        toast.success("Group created successfully!");
        setGroupName("");
        setGroupSecret("");
        setIsPrivate(false);
        setOpen(false);
        userProfile?.owned?.push([groupName, { members: [response.username], secret: groupSecret, privacy: isPrivate }]);
        setLoaderState(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
    catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  const deleteHandler = async (groupName: string) => {
    if (!groupName) {
      toast.error("Please select a group to delete.");
      return;
    }
    try {
      const response = await GroupAPI.deleteGroup(groupName, user?.uid || "");
      if (!response.success) {
        toast.error("Failed to delete group: " + response.message);
      } else {
        toast.success("Group deleted successfully!");
        setUserProfile((prevProfile) => {
          if (!prevProfile) return null;
          return {
            ...prevProfile,
            owned: prevProfile.owned.filter((group) => Array.isArray(group) && group[0] !== groupName),
          };
        });
        setLoaderState(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while deleting the group.");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!localStorage.getItem("uuid")) {
        toast.error("You are not logged in!");
        router.push("/sign-in");
        return;
      }
      if (localStorage.getItem('uuid')) {
        try {
          const linked = await UserAPI.getUserStatus(localStorage.getItem('uuid') || "");
          console.log("dashboard")
          const profile = await UserAPI.getUserProfile(localStorage.getItem('uuid') || "");
          if (!linked.found) {
            toast("You account is not linked yet!");
            router.push("/link");
          }
          if (profile) {
            setUserProfile(profile);
            setFetching(false);
          } else {
            toast.error("Failed to fetch user profile.");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("An error occurred while fetching your profile.");
        }
      }
    };
    fetchUserProfile();
    setTimeout(() => {
      setLoaderState(false);
    }, 500);
  }, [router]);


  const handlePrivacyToggle = async (groupName: string, privacy: boolean) => {
    setIsPrivacyLoading(true);
    try {
      const response = await GroupAPI.changeGroupPrivacy(groupName, privacy);
      if (response.success) {
        toast.success(`Group "${groupName}" privacy updated successfully!`);
        userProfile?.owned?.forEach((group) => {
          if (Array.isArray(group) && group[0] === groupName) {
            group[1].privacy = privacy;
          }
        });
      } else {
        toast.error(response.message || "Failed to update group privacy.");
      }
    } catch (error) {
      console.error("Error changing group privacy:", error);
      toast.error("An error occurred while updating group privacy.");
    } finally {
      setIsPrivacyLoading(false);
    }
  }

  if (loaderState) {
    return <Loader />
  }

  if (fetching) {
  return (
    <div className="flex flex-col h-[92dvh] bg-muted transition-all duration-700 opacity-100 translate-y-0">
      <div className="flex flex-1 flex-col md:flex-row md:items-start md:justify-between p-4 md:p-10 gap-12 md:gap-64 mx-[10vw]">
        {/* Groups Section Skeleton */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center md:mt-10 w-full">
          <div className="flex w-full items-center justify-between mb-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="w-full border-t border-gray-300 mb-6" />
          <div className="w-full flex flex-col gap-6 items-start">
            {/* Skeleton for groups */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full flex flex-row items-center justify-between px-6 py-6 shadow-xl/15">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Profile Card Skeleton */}
        <div className="w-full max-w-sm md:sticky md:top-24 md:self-start md:my-10">
          <Card className='shadow-xl/30'>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-6 w-32 mt-2" />
              </div>
            </CardHeader>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                User Statistics
              </span>
            </div>
            <CardContent>
              <div className="space-y-6">
                {/* Progress bars skeleton */}
                {['Total', 'Easy', 'Medium', 'Hard'].map((label) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-3 w-full rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-8">
              <Skeleton className="h-12 w-full rounded-xl" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

  return (
    <>
    <div className='w-[100dvh] overflow-hidden'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="fixed bottom-6 right-6 z-50 text-white rounded-full shadow-lg p-4 hover:bg-destructive/50 transition-colors flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold mb-2 text-center">
            Sign Out
          </DialogTitle>
          <DialogDescription className="text-center mb-4">
            Are you sure you want to sign out?
          </DialogDescription>
          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              onClick={() => {
                doSignOut();
                toast.success("Signed out successfully!");
                router.push("/");
              }}
            >
              Sign Out
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    <div className="flex flex-col h-[92dvh] bg-muted transition-all duration-700 opacity-100 translate-y-0 overflow-x-hidden">
      <div className="flex flex-1 flex-col lg:flex-row lg:items-start lg:justify-between p-4 md:p-10 md:pb-0 gap-12 md:gap-64 md:mx-[10vw]">
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center lg:mt-10 w-full">
          <div className="flex w-full items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left transition-all">
              Groups
            </h1>
            {userProfile?.owned && userProfile.owned.length < 4? (
              <CreateDialog
                groupName={groupName}
                setGroupName={setGroupName}
                groupSecret={groupSecret}
                setGroupSecret={setGroupSecret}
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                isLoading={isLoading}
                createHandler={createHandler}
                open={open}
                setOpen={setOpen}
              />
            ) : <p className='opacity-20'>Group Limit Reached</p>}
          </div>
          <div className="w-full border-t border-gray-300 mb-6" />
          {userProfile?.owned?.length ? (
            <div className="w-full flex flex-col gap-6 items-start">
              {userProfile.owned.map((ownedGroup) => {
              // ownedGroup is a tuple: [groupName, groupInfo]
              // groupInfo: { members: string[], secret: string, privacy: boolean }
              const [group, groupInfo] = Array.isArray(ownedGroup) ? ownedGroup : [ownedGroup, { members: [], secret: '', privacy: true }];
              return (
                <Card key={group} className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-6 shadow-xl/15">
                <div>
                  <CardTitle className="text-xl"><Link href={'/' + group} className='hover:underline'>{group}</Link></CardTitle>
                </div>
                <div className="flex items-center gap-4">
                  {groupInfo.privacy ? "Private Group" : "Public Group"}
                  <Switch
                  id={`group-${group}`}
                  checked={groupInfo.privacy}
                  onCheckedChange={(checked) => handlePrivacyToggle(group, checked)}
                  className="bg-gray-300 hover:bg-gray-400 transition-colors"
                  disabled={isPrivacyLoading}
                  />
                  <SettingsDrawer
                    groupName={group}
                    groupMembers={groupInfo.members}
                    groupSecret={groupInfo.secret}
                  />
                  <DeleteDialog
                    groupName={group}
                    deleteHandler={deleteHandler}
                  />
                  <Button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${group}?code=${groupInfo.secret}`);
                    toast.success('Group link copied to clipboard!');
                  }}>
                    <Share />
                  </Button>
                </div>
                </Card>
              );
              })}
            </div>
          ) : (
            <Card className="w-full text-center py-8 shadow-xl/15">
              <CardDescription>No owned groups found.</CardDescription>
            </Card>
          )}
        </div>
        <div className="w-full lg:max-w-sm md:mt-10">
          <Card className='w-full shadow-xl/30'>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-20 h-20">
                  {userProfile?.userAvatar ? (
                    <AvatarImage src={userProfile.userAvatar} alt="User Avatar" />
                  ) : (
                    <AvatarFallback className="text-3xl font-bold">
                    {userProfile?.username?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  )}
                  </Avatar>
              <CardTitle className="text-xl mt-2">{userProfile?.username}</CardTitle>
              </div>
            </CardHeader>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  User Statistics
                </span>
            </div>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">Total</span>
                    <span className="text-sm text-white">{userProfile?.total ?? 0} / 3571</span>
                  </div>
                  <Progress value={userProfile ? (userProfile.total / 3571) * 100 : 0} className="h-3 bg-white/20" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#1cbaba]">Easy</span>
                    <span className="text-sm text-[#1cbaba]">{userProfile?.easy ?? 0} / 880</span>
                  </div>
                  <Progress value={userProfile ? (userProfile.easy / 880) * 100 : 0} className="h-3 bg-white/20" color='#1cbaba'/>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#ffa41d]">Medium</span>
                    <span className="text-sm text-[#ffa41d]">{userProfile?.medium ?? 0} / 1852</span>
                  </div>
                  <Progress value={userProfile ? (userProfile.medium / 1852) * 100 : 0} className="h-3 bg-white/20" color='#ffa41d'/>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#f63737]">Hard</span>
                    <span className="text-sm text-[#f63737]">{userProfile?.hard ?? 0} / 839</span>
                  </div>
                  <Progress value={userProfile ? (userProfile.hard / 839) * 100 : 0} className="h-3 bg-[#1cbaba] bg-[#f63737] bg-[#ffa41d] bg-white/20" color='#f63737' />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-8">
              <Button
                asChild
                size="lg"
                className="w-full bg-[#ffa41d] hover:bg-[#ffb84d] text-white font-bold text-base py-6 rounded-xl transition"
              >
                <Link
                href={"https://leetcode.com/u/" + userProfile?.username}
                target="_blank"
                rel="noopener noreferrer"
                >
                View LeetCode Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <div className="flex justify-center m-8">
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
export default ProfilePage;