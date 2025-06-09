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
import { useSearchParams, useParams } from 'next/navigation';
import JoinDialog from '@/components/JoinDialog';
import UserAPI from '@/api/user';
import { Share } from 'lucide-react';

export default function GroupPage() {
  const [members, setMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaderState, setLoaderState] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [groupSecret, setGroupSecret] = useState<string>('');
  const [isPrompted, setIsPrompted] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const params = useParams();
  useEffect(() => {
    if (params.group) {
      setLoaderState(true);
      const groupSlug = params.group as string;
      document.title = 'Leaderboard - ' + groupSlug;
      if (groupSlug.length > 0) {
        setTimeout(() => {
          setLoaderState(false);
        }, 2000);
      }
    }
  }, [params.group]);

  useEffect(() => {
    setTimeout(() => {
      setLoaderState(false);
    }, 2000);
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const groupSlug = window.location.pathname.split('/')[1];
        const groupData = await GroupAPI.getGroup(groupSlug || '', searchParams.get('code'));
        if (!groupData.success) {
          toast.error(groupData.error || 'Failed to fetch group data');
          setNotFound(true);
          setError(groupData.error);
          return;
        }
        console.log('Fetched group data:', groupData);
        if (groupData.prompt) {
          setOpen(true);
          setIsPrompted(true);
        }
        if (groupData.groupSecret) {
          setGroupSecret(groupData.groupSecret);
        }
        setMembers(groupData.members);
      } catch (error) {
        toast.error('An error occurred while fetching group data');
        console.error('Error fetching group data:', error);
      }
      setLoading(false);
    };
    fetchGroupData();
  }, [ searchParams, params ]);

  const joinHandler = async () => {
    try {
      setIsJoining(true);
      if (localStorage.getItem('uuid') === null) {
        if (inputValue.trim() === '') {
          toast.error('Please enter a username');
          return;
        }
        localStorage.setItem('anon-username', "anon-" + inputValue.trim());
        const response = await UserAPI.addAnonUserToGroup(params.group as string, searchParams.get('code') || '');
        if (!response.success) {
          toast.error(response.error || 'Failed to join the group');
          localStorage.removeItem('anon-username');
          return;
        }
        toast.success('You have joined the group successfully!');
      } else {
        const response = await UserAPI.addUserToGroup(params.group as string, searchParams.get('code') || '');
        if (!response.success) {
          toast.error(response.error || 'Failed to join the group');
          return;
        }
        toast.success('You have joined the group successfully!');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('An error occurred while joining the group');
    } finally {
      setIsJoining(false);
      setInputValue('');
      setOpen(false);
    }
  }

  if (loaderState) {
    return <Loader />
  }

  return (
    <main className='bg-muted min-h-screen flex flex-col items-center pt-0 p-4 overflow-x-hidden'>
      <Topnav />
      <div className={isPrompted ? 'block' : 'hidden'}>
        <JoinDialog 
          open={open} 
          setOpen={setOpen} 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          joinHandler={joinHandler}
          groupName={params.group as string}
          isJoining={isJoining}
          groupSecret={searchParams.get('code') || ''}
        />
      </div>
      <div className='mt-8 pb-30 md:pb-10'>
        {!notFound && loading ? (
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
        {members.map((member, rank) => { 
          return(
          <div 
            key={rank} 
            className={`
              flex flex-col md:flex-row items-center justify-between
              animate-float-in
            `}
            style={{
              animationDelay: `${rank * 0.15}s`,
              animationFillMode: 'both'
            }}
          >
            <span
              className={`
                italic text-2xl font-semibold flex items-center justify-center
                ${rank === 0 ? 'text-yellow-500' : rank === 1 ? 'text-gray-300' : rank === 2 ? 'text-orange-500' : 'text-gray-500'}
                mr-4 md:mr-8 md:mb-0 mb-2
              `}
              style={{ minWidth: 40 }}
            >
              #{rank + 1}
            </span>
            <UserCard key={member.username || rank} {...member} />
          </div>
        )})}
        {notFound && (
          <div className="text-center text-gray-500 mt-8">
            {error}
          </div>
        )}
        {groupSecret !== '' && (
          
        <button
          onClick={() => {
            const url = `${window.location.origin}${window.location.pathname}?code=${groupSecret}`;
            navigator.clipboard.writeText(url);
            toast.success('Group link copied to clipboard!');
          }}
          className="fixed bottom-6 right-6 z-50 bg-black text-white rounded-full shadow-lg p-4 hover:bg-primary/90 transition-colors flex items-center gap-2"
          aria-label="Share group link"
        >
          <Share className="w-5 h-5" />
          <span className="hidden sm:inline">Invite to group</span>
        </button>)}
      </div>
    </main>
  );
}