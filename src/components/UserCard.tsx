import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { UserType } from './Types';

export default function UserCard(user: UserType) {
  return (
    <Card className="w-full flex flex-col sm:flex-row items-center px-4 sm:px-8 py-4 sm:py-6 gap-4 sm:gap-6 mb-4">
      <CardHeader className="flex flex-row items-center w-full sm:w-1/4 gap-4 p-0 w-[80vw]">
        <Avatar className="w-14 h-14 sm:w-16 sm:h-16 mx-auto sm:mx-0">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="flex-1 w-full">
        <CardTitle className="text-base sm:text-lg font-semibold text-center sm:text-left" title={user.name}>
          {user.name.length > 18 ? user.name.slice(0, 16) + '...' : user.name}
        </CardTitle>
        <CardDescription
          className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left"
          title={`@${user.username}`}
        >
          <Link href={`https://leetcode.com/u/${user.username}`} target="_blank" rel="noopener noreferrer">
            @{user.username.length > 12
              ? user.username.slice(0, 10) + '...'
              : user.username}
          </Link>
        </CardDescription>
      </CardContent>
      <CardContent className="flex flex-wrap sm:flex-nowrap flex-1 justify-between items-center gap-2 sm:gap-4 p-0 w-full sm:w-auto">
        <div className="w-1/5 sm:w-20 text-center">
          <h3 className="text-xs sm:text-sm font-semibold">Solved</h3>
          <p className="text-base sm:text-lg">{user.questionsSolved}</p>
        </div>
        <div className="w-1/5 sm:w-20 text-center">
          <h3 className="text-xs sm:text-sm font-semibold">Points</h3>
          <p className="text-base sm:text-lg">{user.points}</p>
        </div>
        <div className="w-1/5 sm:w-20 text-center">
          <h3 className="text-xs sm:text-sm font-semibold">Easy</h3>
          <p className="text-base sm:text-lg">{user.easy}</p>
        </div>
        <div className="w-1/5 sm:w-20 text-center">
          <h3 className="text-xs sm:text-sm font-semibold">Medium</h3>
          <p className="text-base sm:text-lg">{user.medium}</p>
        </div>
        <div className="w-1/5 sm:w-20 text-center">
          <h3 className="text-xs sm:text-sm font-semibold">Hard</h3>
          <p className="text-base sm:text-lg">{user.hard}</p>
        </div>
      </CardContent>
      <CardFooter className="w-full sm:w-1/5 flex justify-end p-0 mt-2 sm:mt-0">
        <Link 
          href={`https://leetcode.com/u/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:min-w-[150px] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center no-underline text-sm sm:text-base"
        >
          View Profile
        </Link>
      </CardFooter>
    </Card>
  );
}
