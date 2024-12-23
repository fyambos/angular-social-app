import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  signupError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  signup() {
    this.authService
      .signUp(this.email, this.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.signupError = error.message;
      });
  }
}
