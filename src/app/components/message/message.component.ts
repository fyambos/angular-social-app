import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  recipientId: string = '';
  recipientNickname: string = '';
  conversations: any[] = [];
  messages: any[] = [];
  currentUserId: string = 'currentUserId';
  newMessage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.recipientId = params.get('recipientId') || '';
      this.loadRecipientNickname();
      this.loadMessages();
      this.loadConversations();
    });
  }

  loadRecipientNickname(): void {
    this.recipientNickname = 'Recipient Name';
  }

  loadMessages(): void {
    this.messages = [
      { senderId: 'currentUserId', text: 'Hello!' },
      { senderId: 'otherUserId', text: 'Hi, how are you?' },
    ];
  }

  loadConversations(): void {
    this.conversations = [
      { recipientId: 'user1', nickname: 'Alice', lastMessage: 'See you soon!' },
      { recipientId: 'user2', nickname: 'Bob', lastMessage: 'Okay, thanks!' },
    ];
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        senderId: this.currentUserId,
        text: this.newMessage.trim(),
      });
      this.newMessage = '';
    }
  }
}
