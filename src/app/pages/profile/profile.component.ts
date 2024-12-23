import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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

  constructor(private auth: Auth, private firestore: Firestore, private authService: AuthService) {}

  ngOnInit(): void {
    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is logged in, fetch their profile data
        this.fetchUserProfile(user.uid);
      } else {
        // User is not logged in, reset the profile
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
}
