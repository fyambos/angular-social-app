import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { PostService } from 'src/app/services/post.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  userProfile: User = {
    id: '',
    nickname: '',
    profilePicture: 'assets/default-profile-picture.jpg',
    bio: '',
    joinedDate: ''
  };
  currentUserUid: string = '';
  private postsSubscription?: Subscription;

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
        this.initializePosts();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  private fetchUserProfile(uid: string): void {
    this.userService.fetchUserProfile(uid).then((profile) => {
      this.userProfile = profile;
    }).catch((error) => {
      console.error('Error fetching user profile:', error);
    });
  }

  private initializePosts(): void {
    this.postService.initializePosts();
    this.postsSubscription = this.postService.getPosts$().subscribe(posts => {
      this.posts = posts;
    });
  }

  openNewPostDialog(): void {
    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newPost) => {
      if (newPost) {
        const postToAdd = {
          userId: this.currentUserUid,
          user: this.userProfile,
          ...newPost,
          likes: []
        };

        this.postService.addPost(postToAdd).catch((error) => {
          console.error('Error adding new post:', error);
        });
      }
    });
  }
}