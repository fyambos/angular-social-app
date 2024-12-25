import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, addDoc, collectionGroup, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private firestore: Firestore) {}

  getConversations(currentUserId: string): Observable<Conversation[]> {
    return new Observable(subscriber => {
      const q = query(
        collectionGroup(this.firestore, 'messages'),
        where('participants', 'array-contains', currentUserId),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const conversationsMap = new Map<string, Conversation>();
        
        querySnapshot.forEach(doc => {
          const message = doc.data() as Message;
          const otherUserId = message.senderId === currentUserId 
            ? message.recipientId 
            : message.senderId;

          if (!conversationsMap.has(otherUserId) || 
              (conversationsMap.get(otherUserId)?.lastMessageTimestamp ?? 0) < message.timestamp) {
            conversationsMap.set(otherUserId, {
              recipientId: otherUserId,
              nickname: '',
              profilePicture: '',
              lastMessage: message.text,
              lastMessageTimestamp: message.timestamp
            });
          }
        });

        const conversations = Array.from(conversationsMap.values());
        for (const conversation of conversations) {
          const userDoc = await getDoc(doc(this.firestore, 'users', conversation.recipientId));
          const userData = userDoc.data();
          
          if (userData) {
            conversation.nickname = userData['nickname'] || 'Unknown User';
            conversation.profilePicture = userData['profilePicture'] || '';
          }
        }

        subscriber.next(conversations);
      });

      return () => unsubscribe();
    });
  }

  getMessages(currentUserId: string, recipientId: string): Observable<Message[]> {
    return new Observable(subscriber => {
      const q = query(
        collection(this.firestore, 'messages'),
        where('participants', '==', [currentUserId, recipientId].sort()),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => doc.data() as Message);
        subscriber.next(messages);
      });

      return () => unsubscribe();
    });
  }

  async sendMessage(
    currentUserId: string,
    recipientId: string,
    messageText: string
  ): Promise<Message> {
    const newMessage: Message = {
      senderId: currentUserId,
      recipientId: recipientId,
      text: messageText,
      timestamp: new Date(),
    };

    const messageWithParticipants = {
      ...newMessage,
      participants: [currentUserId, recipientId].sort()
    };

    await addDoc(
      collection(this.firestore, 'messages'),
      messageWithParticipants
    );

    return newMessage;
  }
}
