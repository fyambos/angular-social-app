import { Component, OnInit } from '@angular/core';

interface User {
  nickname: string;
  profilePicture: string;
}

interface Post {
  user: User;
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  users: User[] = [
    { nickname: 'JohnDoe', profilePicture: 'assets/default-profile-picture.jpg' },
    { nickname: 'JaneSmith', profilePicture: 'assets/default-profile-picture.jpg' },
    { nickname: 'DevGuru', profilePicture: 'assets/default-profile-picture.jpg' },
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
