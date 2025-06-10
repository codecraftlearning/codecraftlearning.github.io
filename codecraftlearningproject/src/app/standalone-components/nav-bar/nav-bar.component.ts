import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Auth, authState, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { from, map, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnDestroy {
  @Input()
  public isFlex: boolean = true;
  public showDropdown: boolean = false;
  public isLoggedIn: boolean = false;
  public navItems = [
    { name: 'About', path: '/pages/home', type: 'link', fragment: '' },
    { name: 'Courses', path: '/pages/courses', type: 'link', fragment: '' },
    { name: 'Collaboration', path: '/pages/collaboration', type: 'link', fragment: '' },
    { name: 'Testimonials', path: '/pages/testimonials', type: 'link', fragment: '' },
    { name: 'Certification', path: '/pages/certification', type: 'link', fragment: '' },
    { name: 'Contact', path: '', type: 'fragment', fragment: 'contact' }
  ]
  private subscription: Subscription = new Subscription();

  constructor(private auth: Auth, private router: Router, private cdf: ChangeDetectorRef) {
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const sub = onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
      this.cdf.detectChanges(); // Trigger change detection to update the UI 
    });
    this.subscription.add(sub);
  }


  public googleLogin() {
    const sub = from(signInWithPopup(this.auth, new GoogleAuthProvider())).subscribe((result) => {
      // Handle successful login here
      this.router.navigate(['/admin/students']); // Navigate to the students component after login
    }, error => {
      // Handle login error here
      console.error('Login failed:', error);
    });

    this.subscription.add(sub);
  }

  public logout() {
    const sub = from(signOut(this.auth)).subscribe(() => {
      // Handle successful logout here
      this.router.navigate(['/']); // Navigate to the home page after logout
    }, error => {
      // Handle logout error here
      console.error('Logout failed:', error);
    });

    this.subscription.add(sub);
  }

  public scrollTo(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Clean up the subscription to avoid memory leaks
  }

  public get shouldDisplayBurger(): boolean {
    return window.screen.width <= 390;
  }
}
