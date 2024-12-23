import { Component, OnInit } from '@angular/core';

interface Post {
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  userProfile = {
    username: 'john_doe',
    bio: 'Web developer with a passion for Angular and TypeScript. Love exploring new technologies.',
    joinedDate: '2024-01-15',
    profilePicture: 'assets/default-profile-picture.jpg'
  };

  posts: Post[] = [
    {
      title: 'My first post',
      content: 'This is my very first post! Excited to share my thoughts here.',
      date: '2024-12-23'
    },
    {
      title: 'Angular is awesome!',
      content: 'I have been learning Angular for a while now, and it is amazing!',
      date: '2024-12-22'
    },
    {
      title: 'TailwindCSS is great!',
      content: 'I just started using TailwindCSS and I love how it makes styling easier.',
      date: '2024-12-21'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
