import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from '@angular/fire/firestore';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { User as UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser$.next(user);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  fetchUserProfile(uid: string): Promise<UserProfile> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return {
          id: uid,
          nickname: userData['nickname'] || '',
          profilePicture: userData['profilePicture'] || 'assets/default-profile-picture.jpg',
          bio: userData['bio'] || '',
          joinedDate: userData['joinedDate'] || '',
        } as UserProfile;
      } else {
        console.error(`User profile not found for uid: ${uid}, document path: users/${uid}`);
        throw new Error('User profile not found');
      }
    });
  }
  
  updateUserProfile(uid: string, updatedProfile: any): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDocRef, updatedProfile);
  }

  searchUsers(searchQuery: string): Observable<any[]> {
    const usersCollectionRef = collection(this.firestore, 'users');
    const usersQuery = query(
      usersCollectionRef,
      where('nickname', '>=', searchQuery),
      where('nickname', '<=', searchQuery + '\uf8ff'),
      orderBy('nickname')
    );
    return new Observable<any[]>((observer) => {
      getDocs(usersQuery).then((querySnapshot) => {
        const users = querySnapshot.docs.map((doc) => doc.data());
        observer.next(users);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
