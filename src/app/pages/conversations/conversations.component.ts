import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Conversation } from 'src/app/models/conversation.model';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadConversations();
      }
    });
    this.route.paramMap.subscribe((params) => {
      this.loadConversations();
    });
  }

  loadConversations(): void {
    if (this.currentUserId) {
      this.messageService.conversations$.subscribe((conversations) => {
        this.conversations = conversations;
      });
      this.messageService.getConversations(this.currentUserId);
    }
  }

}
