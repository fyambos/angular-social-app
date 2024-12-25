export interface Message {
    senderId: string;
    recipientId: string;
    text: string;
    timestamp: string;
    participants?: string[];
    read?: boolean;
  }