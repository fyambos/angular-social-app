import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { MessageService } from 'src/app/services/message.service';
import { onAuthStateChanged } from 'firebase/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  recipientId: string = '';
  recipientNickname: string = '';
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
      this.loadRecipientNickname(); 
    });
  }

  loadRecipientNickname(): void {
    if (this.recipientId) {
      this.userService.fetchUserProfile(this.recipientId).then(
        (userData) => {
          this.recipientNickname = userData.nickname;
        }
      ).catch(
        (error) => {
          console.error('Error loading recipient nickname:', error);
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
        });
    }
  }

  loadConversations(): void {
    if (this.currentUserId) {
      this.messageService
        .getConversations(this.currentUserId)
        .subscribe((conversations) => {
          this.conversations = conversations;
        });
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
