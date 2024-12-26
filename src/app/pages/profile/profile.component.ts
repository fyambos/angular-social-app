import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { EditProfileDialogComponent } from 'src/app/components/edit-profile-dialog/edit-profile-dialog.component';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LikesModalComponent } from 'src/app/components/likes-modal/likes-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile: User = {
    id: '',
    nickname: '',
    bio: '',
    profilePicture: 'assets/default-profile-picture.jpg',
    joinedDate: '',
    followers: [],
    following: []
  };
  posts: Post[] = [];
  currentUserUid: string = '';
  displayedUserUid: string = '';
  isFollowing: boolean = false;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private postService: PostService,
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.displayedUserUid = params.get('uid') || '';
      if (this.displayedUserUid) {
        this.fetchUserProfile(this.displayedUserUid);
        this.loadUserPosts(this.displayedUserUid);
        this.checkIfFollowing();
      }
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserUid = user.uid;
        if (!this.displayedUserUid) {
          this.fetchUserProfile(this.currentUserUid);
          this.loadUserPosts(this.currentUserUid);
          this.displayedUserUid = this.currentUserUid;
        }
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
      this.postService.getPostsByUserId(uid).subscribe((posts) => {
        this.posts = posts;
      });
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
      if (user && user.uid === this.currentUserUid) {
        this.userService.updateUserProfile(user.uid, updatedProfile).then(() => {
          this.userProfile = { ...this.userProfile, ...updatedProfile };
        });
      }
    });
  }

  isCurrentUserProfile(): boolean {
    return this.currentUserUid === this.displayedUserUid;
  }

  openNewPostDialog(): void {
    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newPost) => {
      if (newPost) {
        const postToAdd = {
          userId: this.currentUserUid,
          ...newPost,
          likes: []
        };

        this.postService.addPost(postToAdd).catch((error) => {
          console.error('Error adding new post:', error);
        });
      }
    });
  }

  sendMessage(): void {
    this.router.navigate(['/messages', this.displayedUserUid]);
  }

  private checkIfFollowing(): void {
    if (this.currentUserUid && this.displayedUserUid) {
      this.userService.fetchUserProfile(this.currentUserUid).then((currentUser) => {
        this.isFollowing = currentUser.following.includes(this.displayedUserUid);
      });
    }
  }
  
  followUser(): void {
    this.userService.followUser(this.currentUserUid, this.displayedUserUid).then(() => {
      this.isFollowing = true;
      this.fetchUserProfile(this.displayedUserUid);
    });
  }
  
  unfollowUser(): void {
    this.userService.unfollowUser(this.currentUserUid, this.displayedUserUid).then(() => {
      this.isFollowing = false;
      this.fetchUserProfile(this.displayedUserUid);
    });
  }

  showFollowers(): void {
    this.userService.getFollowers(this.displayedUserUid).then((followers) => {
      this.dialog.open(LikesModalComponent, {
        width: '400px',
        data: { 
          users: followers,
          title: 'Followers',
        },
      });
    });
  }
  
  showFollowing(): void {
    this.userService.getFollowing(this.displayedUserUid).then((following) => {
      this.dialog.open(LikesModalComponent, {
        width: '400px',
        data: { 
          users: following,
          title: 'Following',
        },
      });
    });
  }
}
