import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  query: string = '';
  results: any[] = [];
  users: any[] = [];
  loading: boolean = false;
  selectedTab: 'posts' | 'users' = 'posts';
  currentUserUid: string = '';

  constructor(
    private postService: PostService,
    private userService: UserService,
    private auth: Auth,
  ) {}

ngOnInit(): void {
    
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserUid = user.uid;
      }
    });
  }

  toggleTab(tab: 'posts' | 'users'): void {
    this.selectedTab = tab;
    this.onSearch();
  }

  onSearch(): void {
    if (this.query.trim() === '') {
      this.results = [];
      this.users = [];
      return;
    }

    this.loading = true;

    if (this.selectedTab === 'posts') {
      this.postService.searchPosts(this.query).subscribe((posts) => {
        this.results = posts;
        this.loading = false;
      });
    } else {
      this.userService.searchUsers(this.query).subscribe((users) => {
        this.users = users;
        this.loading = false;
      });
    }
  }
}
