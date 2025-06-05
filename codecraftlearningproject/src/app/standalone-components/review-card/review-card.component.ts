import { Component, Input } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { CommonModule } from '@angular/common';
import { Rating } from '../../interfaces/rating.interface';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [RatingComponent, CommonModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {

  @Input()
  public review?: Rating;
  
  @Input()
  public size: 'sm' | 'lg' = 'sm';
}
