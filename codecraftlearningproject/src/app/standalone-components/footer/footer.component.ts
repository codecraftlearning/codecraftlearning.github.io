import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnDestroy {

  public isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private auth: Auth, private cdf: ChangeDetectorRef) {
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const sub = onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
      this.cdf.detectChanges(); // Trigger change detection to update the UI 
    });
    this.subscription.add(sub);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Clean up the subscription to avoid memory leaks
  }
}
