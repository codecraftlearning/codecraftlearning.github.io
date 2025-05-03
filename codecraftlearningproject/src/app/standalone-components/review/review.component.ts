import { Component } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReviewCardComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

}
