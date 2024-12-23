import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  signupError: string = '';

  constructor(private authService: AuthService) {}

  signup() {
    this.authService
      .signUp(this.email, this.password)
      .catch((error) => {
        this.signupError = error.message;
      });
  }
}
