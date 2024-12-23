import { Component } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  message: string = '';

  constructor() {}

  printMessage(): void {
    console.log(this.message);
    this.message = '';
  }
}
