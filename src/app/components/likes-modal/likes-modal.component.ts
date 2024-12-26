import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-likes-modal',
  templateUrl: './likes-modal.component.html',
})
export class LikesModalComponent {
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { users: User[]; title: string },
    private router: Router,
  ) {
    this.title = data.title;
  }

  navigateToUserProfile(userId: string): void {
    this.router.navigate([`/profile/${userId}`]);
  }
}
