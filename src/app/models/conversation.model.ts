export interface Conversation {
  recipientId: string;
  nickname: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  profilePicture: string;
  unreadCount: number;
}