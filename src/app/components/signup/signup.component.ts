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

  async signup() {
    this.signupError = '';
    try {
      await this.authService.signUp(this.email, this.password);
      await this.router.navigate(['/home']);
    } catch (error: any) {
      this.signupError = error?.message ?? 'Sign up failed';
    }
  }
}
