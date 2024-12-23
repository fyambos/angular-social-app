import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { EditProfileDialogComponent } from 'src/app/components/edit-profile-dialog/edit-profile-dialog.component';

interface Post {
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile = {
    nickname: '',
    bio: '',
    profilePicture: 'assets/default-profile-picture.jpg',
    joinedDate: ''
  };
  posts: Post[] = [
    {
      title: 'My first post',
      content: 'This is my very first post! Excited to share my thoughts here.',
      date: '2024-12-23'
    },
    {
      title: 'Angular is awesome!',
      content: 'I have been learning Angular for a while now, and it is amazing!',
      date: '2024-12-22'
    },
    {
      title: 'TailwindCSS is great!',
      content: 'I just started using TailwindCSS and I love how it makes styling easier.',
      date: '2024-12-21'
    }
  ];

  constructor(private auth: Auth, private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.fetchUserProfile(user.uid);
      } else {
        this.userProfile = {
          nickname: '',
          bio: '',
          profilePicture: 'assets/default-profile-picture.jpg',
          joinedDate: ''
        };
      }
    });
  }

  private fetchUserProfile(uid: string): void {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          this.userProfile = docSnap.data() as any;
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: { ...this.userProfile }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUserProfile(result);
      }
    });
  }

  private updateUserProfile(updatedProfile: any): void {
    const user = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      updateDoc(userDocRef, updatedProfile)
        .then(() => {
          this.userProfile = { ...this.userProfile, ...updatedProfile };
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  }
}
