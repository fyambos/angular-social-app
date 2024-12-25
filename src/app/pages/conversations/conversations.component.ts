import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Conversation } from 'src/app/models/conversation.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
})
export class ConversationsComponent implements OnInit {
  currentUserId: string = '';
  conversations: Conversation[] = [];

  constructor(
    private messageService: MessageService,
    private auth: Auth,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get current user id from Firebase authentication
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadConversations();
      }
    });
  }

  loadConversations(): void {
    // Fetch all conversations for the current user
    this.messageService.getConversations(this.currentUserId).subscribe(
      (conversations) => {
        this.conversations = conversations;
      },
      (error) => {
        console.error('Error loading conversations', error);
      }
    );
  }

}
