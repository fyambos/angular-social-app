import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService
      .signIn(this.email, this.password)
      .catch((error) => {
        this.loginError = error.message; 
      });
  }
}
