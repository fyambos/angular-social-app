import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() currentUserUid: string = '';

}
