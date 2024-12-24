import { Component, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() currentUserUid: string = '';
  replyContent: string = '';

  constructor(
    private postService: PostService,
    private router: Router,
  ) {}

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
  replyToPost(): void {
    if (this.replyContent.trim() !== '') {
      this.postService.addReply(this.post.id, this.replyContent, this.currentUserUid);
      this.replyContent = '';
    }
  }
}
