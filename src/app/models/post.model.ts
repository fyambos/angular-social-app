import { User } from './user.model';

export interface Post {
  id: string;
  user: User;
  title: string;
  content: string;
  date: string;
  likes: string[];
}
