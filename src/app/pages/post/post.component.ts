import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  post!: Post;
  currentUserUid: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('uid');
    if (postId) {
      this.loadPost(postId);
    }

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserUid = user.uid;
      }
    });
  }

  private async loadPost(postId: string): Promise<void> {
    try {
      const post = await this.postService.getPostById(postId);
      this.post = post;
    } catch (error) {
      console.error('Error loading post:', error);
    }
  }
  
}
