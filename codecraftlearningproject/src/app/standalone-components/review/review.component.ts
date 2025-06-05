import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { FirebaseCollections } from '../../constants/commons.enum';
import { Rating } from '../../interfaces/rating.interface';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReviewCardComponent, CommonModule, RouterModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit, OnDestroy {

  public reviewLoading: boolean = false;
  public reviews: Rating[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService) { }

  public ngOnInit(): void {
    this.loadReviews();
  }
 

  private loadReviews(): void {
    this.reviewLoading = true;
    const sub = this.firebaseService.getAllFromCollectionWithMaxItems(FirebaseCollections.reviews, 4).subscribe((data: Rating[]) => {
      this.reviews = data;
      this.reviewLoading = false;
    }, (error: any) => {
      console.error('Error loading reviews:', error);
      this.reviewLoading = false;
    });
    this.subscriptions.add(sub);
  }

   public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
