import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { MessageService } from 'src/app/services/message.service';
import { onAuthStateChanged } from 'firebase/auth';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  recipientId: string = '';
  recipient: any = {};
  conversations: any[] = [];
  messages: any[] = [];
  currentUserId: string = '';
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private auth: Auth,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadMessages();
        this.loadConversations();
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.recipientId = params.get('recipientId') || '';
      this.loadRecipient(); 
      this.loadMessages();
    });
  }

  loadRecipient(): void {
    if (this.recipientId) {
      this.userService.fetchUserProfile(this.recipientId).then(
        (userData) => {
          this.recipient = userData;
        }
      ).catch(
        (error) => {
          console.error('Error loading recipient:', error);
        }
      );
    }
  }

  loadMessages(): void {
    if (this.currentUserId && this.recipientId) {
      this.messageService
        .getMessages(this.currentUserId, this.recipientId)
        .subscribe((messages) => {
          this.messages = messages;
          this.messageService.markMessagesAsRead(this.currentUserId, this.recipientId);
        });
    }
  }
  
  loadConversations(): void {
    if (this.currentUserId) {
      this.messageService.conversations$.subscribe((conversations) => {
        this.conversations = conversations;
      });
      this.messageService.getConversations(this.currentUserId);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.currentUserId && this.recipientId) {
      this.messageService
        .sendMessage(this.currentUserId, this.recipientId, this.newMessage.trim())
        .then(() => {
          this.newMessage = '';
        })
        .catch(error => console.error('Error sending message:', error));
    }
  }
}
