import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  }
}
