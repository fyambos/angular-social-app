import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, arrayRemove, arrayUnion, onSnapshot } from '@angular/fire/firestore';
import { Post } from 'src/app/models/post.model';
import { UserService } from './user.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts$ = new BehaviorSubject<Post[]>([]);

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {}

  getPosts$(): Observable<Post[]> {
    return this.posts$.asObservable();
  }

  async initializePosts(): Promise<void> {
    const postsCollection = collection(this.firestore, 'posts');
    
    onSnapshot(postsCollection, async (snapshot) => {
      const postsList: Post[] = [];
      
      for (const docSnap of snapshot.docs) {
        const postData = docSnap.data();
        const user = await this.userService.fetchUserProfile(postData['userId']);
        
        const post: Post = {
          user,
          id: docSnap.id,
          title: postData['title'],
          content: postData['content'],
          date: postData['date'],
          likes: postData['likes'] || [],
        };
        postsList.push(post);
      }
      postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.posts$.next(postsList);
    });
  }
  

  async addPost(newPost: Post): Promise<void> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      await addDoc(postsCollection, {
        ...newPost,
        date: new Date().toISOString(),
        likes: []
      });
    } catch (error) {
      console.error('Error adding post:', error);
      throw new Error('Error adding post');
    }
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const postsQuery = query(postsCollection, where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
  
      const postsList: Post[] = await Promise.all(postsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        const userProfile = await this.userService.fetchUserProfile(userId);
        
        return {
          user: userProfile,
          id: doc.id,
          title: data['title'],
          content: data['content'],
          date: data['date'],
          likes: data['likes'] || [],
        } as Post;
      }));
      postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return postsList;
    } catch (error) {
      console.error('Error fetching posts by userId:', error);
      throw new Error('Error fetching posts');
    }
  }

  likePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(this.firestore, `posts/${postId}`);
    return updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  }

  unlikePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(this.firestore, `posts/${postId}`);
    return updateDoc(postRef, {
      likes: arrayRemove(userId),
    });
  }
}
