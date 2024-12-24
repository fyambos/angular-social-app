import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { Post } from 'src/app/models/post.model';
import { UserService } from './user.service'; 

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {}

  async addPost(newPost: Post): Promise<void> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      await addDoc(postsCollection, newPost);
    } catch (error) {
      console.error('Error adding post:', error);
      throw new Error('Error adding post');
    }
  }

  async getPosts(): Promise<Post[]> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const postsSnapshot = await getDocs(postsCollection);
      
      const postsList: Post[] = [];
      for (const docSnap of postsSnapshot.docs) {
        const postData = docSnap.data();
        const user = await this.userService.fetchUserProfile(postData['userId']); // Fetch user by userId
        
        const post: Post = {
          user, // Set the user object fetched by userId
          title: postData['title'],
          content: postData['content'],
          date: postData['date'],
          likes: postData['likes'] || [],
        };
        postsList.push(post);
      }

      return postsList;
    } catch (error) {
      console.error('Error fetching posts: ', error);
      throw new Error('Error fetching posts');
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
          title: data['title'],
          content: data['content'],
          date: data['date'],
        } as Post;
      }));
  
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
