import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  totalUnreadCount: number = 0;
  currentUserId: string = '';

  constructor(private messageService: MessageService, private auth: Auth) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUnreadMessages();
      }
    });
  }

  loadUnreadMessages(): void {
    if (this.currentUserId) {
      this.messageService.conversations$.subscribe((conversations) => {
        this.totalUnreadCount = conversations.reduce((sum, convo) => sum + (convo.unreadCount || 0), 0);
      });
      this.messageService.getConversations(this.currentUserId);
    }
  }
}
