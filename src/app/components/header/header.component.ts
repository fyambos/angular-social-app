import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService, private auth: Auth) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
