import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  users: User[] = [
    { nickname: 'JohnDoe', profilePicture: 'assets/default-profile-picture.jpg', bio: 'Angular enthusiast', joinedDate: '2023-01-01' },
    { nickname: 'JaneSmith', profilePicture: 'assets/default-profile-picture.jpg', bio: 'CSS expert', joinedDate: '2023-02-01' },
    { nickname: 'DevGuru', profilePicture: 'assets/default-profile-picture.jpg', bio: 'Full-stack developer', joinedDate: '2023-03-01' },
  ];

  posts: Post[] = [
    {
      user: this.users[0],
      title: 'Exploring Angular!',
      content: 'I just started learning Angular, and it’s been an amazing experience so far.',
      date: '2024-12-23',
    },
    {
      user: this.users[1],
      title: 'TailwindCSS Tricks',
      content: 'Styling with TailwindCSS is a game-changer. Highly recommend it!',
      date: '2024-12-22',
    },
    {
      user: this.users[2],
      title: 'Firebase Integration',
      content: 'Firebase has been a lifesaver for quickly setting up authentication and databases.',
      date: '2024-12-21',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
