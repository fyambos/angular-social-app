import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { EditProfileDialogComponent } from 'src/app/components/edit-profile-dialog/edit-profile-dialog.component';
import { User } from 'src/app/models/user.model';

interface Post {
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile: User = {
    nickname: '',
    bio: '',
    profilePicture: 'assets/default-profile-picture.jpg',
    joinedDate: ''
  };

  posts: Post[] = [
    {
      title: 'My first post',
      content: 'This is my very first post! Excited to share my thoughts here.',
      date: '2024-12-23'
    },
    {
      title: 'Angular is awesome!',
      content: 'I have been learning Angular for a while now, and it is amazing!',
      date: '2024-12-22'
    },
    {
      title: 'TailwindCSS is great!',
      content: 'I just started using TailwindCSS and I love how it makes styling easier.',
      date: '2024-12-21'
    }
  ];

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userService.fetchUserProfile(user.uid).then((profile) => {
          this.userProfile = profile;
        });
      }
    });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: { ...this.userProfile }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUserProfile(result);
      }
    });
  }

  private updateUserProfile(updatedProfile: any): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userService.updateUserProfile(user.uid, updatedProfile).then(() => {
          this.userProfile = { ...this.userProfile, ...updatedProfile };
        });
      }
    });
  }
}
