export interface UserType {
  avatar: string;
  username: string;
  name: string;
  questionsSolved: number;
  easy: number;
  medium: number;
  hard: number;
  points: number;
}

export interface GroupType {
  groupname: string;
  totalMembers: number;
  members: UserType[];
}

import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}