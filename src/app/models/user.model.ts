export interface User {
    id: string;
    nickname: string;
    profilePicture: string;
    bio: string;
    joinedDate: string;
    followers: string[];
    following: string[];
    likedPosts?: string[];
  }
  