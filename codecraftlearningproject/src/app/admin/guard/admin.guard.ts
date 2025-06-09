import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  return authState(auth).pipe(
    take(1), // Get the current auth state only once
    map(user => {
      if (user) {
        return true;
      } else {
        // Optional: redirect to login
        window.alert('You must be logged in to access this page');
        return false;
      }
    })
  );
};
