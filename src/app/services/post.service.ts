import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, arrayRemove, arrayUnion, onSnapshot, getDoc } from '@angular/fire/firestore';
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
  
        if (!postData['replyToPostId']) {
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

  getPostsByUserId(userId: string): Observable<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    const postsQuery = query(postsCollection, where('userId', '==', userId));
    return new Observable<Post[]>((observer) => {
      const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
        const postsList: Post[] = await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const user = await this.userService.fetchUserProfile(data['userId']);
          return {
            id: doc.id,
            title: data['title'],
            content: data['content'],
            date: data['date'],
            likes: data['likes'] || [],
            user,
            replyToPostId: data['replyToPostId'] || null,
          } as Post & { replyToPostId?: string };
        }));
        const filteredPosts = postsList.filter(post => !post.replyToPostId);
        filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        observer.next(filteredPosts);
      });
      return () => unsubscribe();
    });
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

  async getPostById(postId: string): Promise<Post> {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    const postDocSnap = await getDoc(postDocRef);
  
    if (postDocSnap.exists()) {
      const postData = postDocSnap.data();
      const user = await this.userService.fetchUserProfile(postData['userId']);
      return {
        user,
        id: postId,
        title: postData['title'],
        content: postData['content'],
        date: postData['date'],
        likes: postData['likes'] || [],
      };
    } else {
      throw new Error('Post not found');
    }
  }

  async addReply(postId: string, replyContent: string, currentUserUid: string): Promise<void> {
    const originalPost = await this.getPostById(postId);
    const replyPost: any = {
      userId: currentUserUid,
      content: replyContent,
      date: new Date().toISOString(),
      likes: [],
      replyToPostId: postId
    };

    try {
      await this.addPost(replyPost);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  }

  async getReplies(postId: string): Promise<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    const repliesQuery = query(postsCollection, where('replyToPostId', '==', postId));
    const querySnapshot = await getDocs(repliesQuery);
    
    const replies: Post[] = [];
    for (const doc of querySnapshot.docs) {
      const replyData = doc.data();
      const user = await this.userService.fetchUserProfile(replyData['userId']);
      const reply: Post = {
        user,
        id: doc.id,
        title: replyData['title'],
        content: replyData['content'],
        date: replyData['date'],
        likes: replyData['likes'] || [],
        replyToPostId: replyData['replyToPostId']
      };
      replies.push(reply);
    }
    return replies;
  }

  async getRepliesCount(postId: string): Promise<number> {
    const repliesCollection = collection(this.firestore, 'posts');
    const repliesQuery = query(repliesCollection, where('replyToPostId', '==', postId));
    const snapshot = await getDocs(repliesQuery);
    return snapshot.size;
  }

}
