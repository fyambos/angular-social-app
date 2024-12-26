import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs, arrayRemove, arrayUnion } from '@angular/fire/firestore';
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
          followers: userData['followers'] || [],
          following: userData['following'] || [],
          likedPosts: userData['likedPosts'] || [],
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

  followUser(currentUserId: string, targetUserId: string): Promise<void> {
    const currentUserRef = doc(this.firestore, `users/${currentUserId}`);
    const targetUserRef = doc(this.firestore, `users/${targetUserId}`);
    
    return Promise.all([
      updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId),
      }),
      updateDoc(targetUserRef, {
        followers: arrayUnion(currentUserId),
      }),
    ]).then(() => console.log('Followed user successfully.'));
  }
  
  unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    const currentUserRef = doc(this.firestore, `users/${currentUserId}`);
    const targetUserRef = doc(this.firestore, `users/${targetUserId}`);
    
    return Promise.all([
      updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId),
      }),
      updateDoc(targetUserRef, {
        followers: arrayRemove(currentUserId),
      }),
    ]).then(() => console.log('Unfollowed user successfully.'));
  }
  
  getFollowers(uid: string): Promise<UserProfile[]> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userDocRef).then(async (docSnap) => {
      const data = docSnap.data();
      if (data && data['followers']) {
        const followers = data['followers'] as string[];
        return Promise.all(followers.map((followerId) => this.fetchUserProfile(followerId)));
      }
      return [];
    });
  }
  
  getFollowing(uid: string): Promise<UserProfile[]> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userDocRef).then(async (docSnap) => {
      const data = docSnap.data();
      if (data && data['following']) {
        const following = data['following'] as string[];
        return Promise.all(following.map((followingId) => this.fetchUserProfile(followingId)));
      }
      return [];
    });
  }

}
