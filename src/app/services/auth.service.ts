import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User, UserCredential, updateProfile } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore, private snackBar: MatSnackBar) {}

  signIn(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.snackBar.open('Logged in successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      })
      .catch((error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        throw error;
      });
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      const cred: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user: User = cred.user;
      const uid = user.uid;
      const nickname = user.email?.split('@')[0] ?? '';
      
      // créer/mettre à jour le doc profil avec merge:true (idempotent)
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, {
        id: uid,
        nickname,
        bio: 'This user has not provided a bio yet.',
        profilePicture: 'assets/default-profile-picture.jpg',
        joinedDate: new Date().toISOString(),
        followers: [],
        following: [],
        likedPosts: [],
      }, { merge: true });

      this.snackBar.open('Account created successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      return cred;
    } catch (error: any) {
      this.snackBar.open(error?.message ?? 'Sign up failed', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw error;
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.snackBar.open('Logged out successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    });
  }
}
