import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Rating } from '../../interfaces/rating.interface';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnInit {
  @Input()
  public rating?: number;
  public maxRating = 5;
  public ratingArray: boolean[] = [];

  public ngOnInit(): void {
    this.createRatingArray();
  }

  private createRatingArray(): void {
    if (this.rating) {
      this.ratingArray = Array.from({ length: this.maxRating }, (_, index) => index >= (this.rating ?? 0)).reverse();
    }
  }
}
