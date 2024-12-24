import { User } from './user.model';

export interface Post {
  user: User;
  title: string;
  content: string;
  date: string;
  likes: string[];
}
