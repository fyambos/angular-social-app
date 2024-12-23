import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { EditProfileDialogComponent } from 'src/app/components/edit-profile-dialog/edit-profile-dialog.component';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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
  posts: Post[] = [];
  currentUserUid: string = '';

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private postService: PostService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserUid = user.uid;
        this.fetchUserProfile(user.uid); 
        this.loadUserPosts(user.uid); 
      }
    });
  }

  private fetchUserProfile(uid: string): void {
    this.userService.fetchUserProfile(uid).then((profile) => {
      this.userProfile = profile;
    }).catch((error) => {
      console.error('Error fetching user profile:', error);
    });
  }

  private async loadUserPosts(uid: string): Promise<void> {
    try {
      this.posts = await this.postService.getPostsByUserId(uid);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
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
