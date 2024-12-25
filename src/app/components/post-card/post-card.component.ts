import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LikesModalComponent } from 'src/app/components/likes-modal/likes-modal.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUserUid: string = '';
  replyContent: string = '';
  showReplyInput: boolean = false;
  repliesCount: number = 0;

  constructor(
    private postService: PostService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadRepliesCount();
  }

  get isLikedByCurrentUser(): boolean {
    return this.post.likes?.includes(this.currentUserUid) ?? false;
  }

  toggleLike(): void {
    if (!this.post || !this.currentUserUid) return;

    const liked = this.isLikedByCurrentUser;

    const likeAction = liked
      ? this.postService.unlikePost(this.post.id, this.currentUserUid)
      : this.postService.likePost(this.post.id, this.currentUserUid);

    likeAction
      .then(() => {
        if (liked) {
          this.post.likes = this.post.likes.filter(uid => uid !== this.currentUserUid);
        } else {
          this.post.likes = [...this.post.likes, this.currentUserUid];
        }
      })
      .catch(error => {
        console.error('Error toggling like:', error);
      });
  }

  navigateToUserProfile(): void {
    this.router.navigate(['/profile', this.post.user.id]);
  }

  navigateToPostView(): void {
    this.router.navigate(['/post', this.post.id]);
  }

  toggleReplyInput(): void {
    this.showReplyInput = !this.showReplyInput;
    if (!this.showReplyInput) {
      this.replyContent = '';
    }
  }

  saveReply(): void {
    if (this.replyContent.trim() !== '') {
      this.postService
        .addReply(this.post.id, this.replyContent, this.currentUserUid)
        .then(() => {
          this.replyContent = '';
          this.showReplyInput = false;
          this.loadRepliesCount();
        })
        .catch(error => {
          console.error('Error saving reply:', error);
        });
    }
  }

  private loadRepliesCount(): void {
    this.postService.getRepliesCount(this.post.id).then(count => {
      this.repliesCount = count;
    }).catch(error => {
      console.error('Error loading replies count:', error);
    });
  }

  openLikesModal(): void {
    this.postService.getUsersWhoLiked(this.post.id).then((users: User[]) => {
      this.dialog.open(LikesModalComponent, {
        width: '400px',
        data: { users },
      });
    }).catch(error => {
      console.error('Error fetching likes:', error);
    });
  }
}
