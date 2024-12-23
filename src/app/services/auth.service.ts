import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore, private snackBar: MatSnackBar) {}

  signIn(email: string, password: string): Promise<any> {
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
      });
  }

  signUp(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user: User = userCredential.user;

        const userProfile = {
          nickname: user.email?.split('@')[0],
          bio: 'This is a default bio. Add your information here!',
          profilePicture: 'assets/default-profile-picture.jpg',
          joinedDate: new Date().toISOString(),
        };

        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, userProfile);

        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      })
      .catch((error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      });
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
