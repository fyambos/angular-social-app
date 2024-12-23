import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = inject(Auth);

  return new Promise<boolean>((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login']); 
        resolve(false);
      }
    });
  });
};
