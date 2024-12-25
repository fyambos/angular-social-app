import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
})
export class NewPostDialogComponent {
  title: string = '';
  content: string = '';
  dialogTitle: string = 'Create a New Post';

  constructor(
    public dialogRef: MatDialogRef<NewPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post?: any }
  ) {
    if (data?.post) {
      this.dialogTitle = 'Edit Post';
      this.title = data.post.title;
      this.content = data.post.content;
    }
  }

  onSave(): void {
    if (this.title && this.content) {
      const newPost = {
        title: this.title,
        content: this.content,
        date: new Date().toLocaleDateString(),
        id: this.data?.post?.id || null,
      };
      this.dialogRef.close(newPost);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
