import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { PostService } from 'src/app/services/post.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  userProfile: User = {
    id: '',
    nickname: '',
    profilePicture: 'assets/default-profile-picture.jpg',
    bio: '',
    joinedDate: ''
  };
  currentUserUid: string = '';

  constructor(
    private dialog: MatDialog,
    private postService: PostService,
    private auth: Auth,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserUid = user.uid;
        this.fetchUserProfile(user.uid); 
        this.loadPosts(); 
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

  private async loadPosts(): Promise<void> {
    try {
      this.posts = await this.postService.getPosts();
  
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
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
        };

        this.postService.addPost(postToAdd).then(() => {
          this.posts.push(postToAdd);
        }).catch((error) => {
          console.error('Error adding new post:', error);
        });
      }
    });
  }
}
