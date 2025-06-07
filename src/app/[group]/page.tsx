'use client'

import Topnav from '@/components/Topnav';
import { useEffect, useState } from 'react';
import GroupAPI from '@/api/group';
import { toast } from 'sonner';
import UserCard from '@/components/UserCard';
import { UserType } from '@/components/Types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from '@/components/Loader';

export default function GroupPage() {
  const [members, setMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaderState, setLoaderState] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoaderState(false);
    }, 2000);
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const groupSlug = window.location.pathname.split('/').pop();
        const groupData = await GroupAPI.getGroup(groupSlug || '', localStorage.getItem('uuid') || 'none');
        if (!groupData.success) {
          toast.error(groupData.error || 'Failed to fetch group data');
          return;
        }
        setMembers(groupData.members || []);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
      setLoading(false);
    };
    fetchGroupData();
  }, []);

  if (loaderState) {
    return <Loader />
  }

  return (
    <main className='bg-muted min-h-screen flex flex-col items-center p-4'>
      <Topnav />
      <div className='mt-8'>
        {loading ? (
          [1, 2, 3, 4, 5].map((_, idx) => (
            <Card key={idx} className="w-full flex flex-col sm:flex-row items-center px-4 sm:px-8 py-4 sm:py-6 gap-4 sm:gap-6 mb-4">
              <CardHeader className="flex flex-row items-center w-full sm:w-1/4 gap-4 p-0 w-[80vw]">
                <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-full" />
              </CardHeader>
              <CardContent className="flex-1 w-full">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
              <CardContent className="flex flex-wrap sm:flex-nowrap flex-1 justify-between items-center gap-2 sm:gap-4 p-0 w-full sm:w-auto">
                {[...Array(5)].map((_, i) => (
                  <div className="w-1/5 sm:w-20 text-center" key={i}>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="w-full sm:w-1/5 flex justify-end p-0 mt-2 sm:mt-0">
                <Skeleton className="w-full sm:min-w-[150px] h-10" />
              </CardFooter>
            </Card>
          ))) : null
        }
        {members.map((member, idx) => (
          <UserCard key={member.username || idx} {...member} />
        ))}
      </div>
    </main>
  );
}