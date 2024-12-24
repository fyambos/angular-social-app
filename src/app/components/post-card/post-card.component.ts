import { Component, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() currentUserUid: string = '';

  constructor(private postService: PostService) {}

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
}
