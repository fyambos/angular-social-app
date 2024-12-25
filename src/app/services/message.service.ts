import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, addDoc, collectionGroup, doc, getDoc, onSnapshot, updateDoc, getDocs, writeBatch } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.model';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  conversations$ = this.conversationsSubject.asObservable();

  constructor(private firestore: Firestore) {}

  getConversations(currentUserId: string): void {
    const q = query(
      collectionGroup(this.firestore, 'messages'),
      where('participants', 'array-contains', currentUserId),
      orderBy('timestamp', 'desc')
    );
  
    onSnapshot(q, async (querySnapshot) => {
      const conversationsMap = new Map<string, Conversation>();
      querySnapshot.forEach(doc => {
        const message = doc.data() as Message;
        const otherUserId = message.senderId === currentUserId 
          ? message.recipientId 
          : message.senderId;
  
        const isUnread = !message.read && message.recipientId === currentUserId;
  
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            recipientId: otherUserId,
            nickname: '',
            profilePicture: '',
            lastMessage: message.text,
            lastMessageTimestamp: message.timestamp,
            unreadCount: isUnread ? 1 : 0,
          });
        } else {
          const conversation = conversationsMap.get(otherUserId)!;
          conversation.unreadCount += isUnread ? 1 : 0;
          if (conversation.lastMessageTimestamp < message.timestamp) {
            conversation.lastMessage = message.text;
            conversation.lastMessageTimestamp = message.timestamp;
          }
        }
      });
  
      const conversations = Array.from(conversationsMap.values());
      this.conversationsSubject.next(conversations);
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
        const messages = querySnapshot.docs.map(doc => {
          const data = doc.data() as Message;
          if (!data.read && data.recipientId === currentUserId) {
            const messageRef = doc.ref;
            updateDoc(messageRef, { read: true });
          }
          return { id: doc.id, ...data };
        });
  
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
      timestamp: new Date().toISOString(),
      read: false,
    };
  
    const messageWithParticipants = {
      ...newMessage,
      participants: [currentUserId, recipientId].sort(),
    };
  
    await addDoc(
      collection(this.firestore, 'messages'),
      messageWithParticipants
    );
  
    return newMessage;
  }  

  async markMessagesAsRead(currentUserId: string, recipientId: string): Promise<void> {
    const q = query(
      collection(this.firestore, 'messages'),
      where('participants', '==', [currentUserId, recipientId].sort()),
      where('read', '==', false),
      where('recipientId', '==', currentUserId) // Only mark messages sent to the current user
    );
  
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(this.firestore);
  
    querySnapshot.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
  
    await batch.commit();
  }
  
}
