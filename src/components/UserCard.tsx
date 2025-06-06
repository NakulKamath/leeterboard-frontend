import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { UserType } from './Types';

export default function UserCard( user: UserType ) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <>
          <CardTitle className="text-center">{user.username}</CardTitle>
          <CardDescription className="text-center">{user.name}</CardDescription>
        </>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium">Total Questions</h3>
          <p className="text-lg">{user.questionsSolved}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Easy Questions</h3>
          <p className="text-lg">{user.easy}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Medium Questions</h3>
          <p className="text-lg">{user.medium}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Hard Questions</h3>
          <p className="text-lg">{user.hard}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-sm font-medium">Total Points</h3>
          <p className="text-lg">{user.points}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`https://leetcode.com/u/${user.username}`} className="text-blue-500 hover:underline">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            View Profile
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}