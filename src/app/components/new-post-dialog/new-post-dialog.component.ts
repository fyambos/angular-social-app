import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
})
export class NewPostDialogComponent {
  title: string = '';
  content: string = '';

  constructor(public dialogRef: MatDialogRef<NewPostDialogComponent>) {}

  onSave(): void {
    if (this.title && this.content) {
      const newPost = {
        title: this.title,
        content: this.content,
        date: new Date().toLocaleDateString(),
      };
      this.dialogRef.close(newPost);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
