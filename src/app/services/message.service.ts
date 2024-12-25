import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  getConversations(currentUserId: string): Observable<any[]> {
    const conversations = [
      { recipientId: 'user1', nickname: 'Alice', lastMessage: 'See you soon!' },
      { recipientId: 'user2', nickname: 'Bob', lastMessage: 'Okay, thanks!' },
    ];
    return of(conversations);
  }

  getMessages(currentUserId: string, recipientId: string): Observable<any[]> {
    const messages = [
      { senderId: 'currentUserId', text: 'Hello!' },
      { senderId: 'otherUserId', text: 'Hi, how are you?' },
    ];
    return of(messages);
  }

  sendMessage(
    currentUserId: string,
    recipientId: string,
    messageText: string
  ): Observable<any> {
    const newMessage = {
      senderId: currentUserId,
      recipientId,
      text: messageText,
      timestamp: new Date(),
    };

    console.log('Message sent:', newMessage);
    return of(newMessage);
  }
}
