import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirebaseCollections } from '../../constants/commons.enum';
import { TechnologyItems } from '../../interfaces/technology-items';
import { FirebaseService } from '../../services/firebase.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-technology',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent implements OnDestroy {

  public technologiesImages: TechnologyItems[][] = [];
  private destroy$ = new Subject<void>();

  constructor(private firebaseService: FirebaseService) {
    this.getTechnologiesImages()
  }

  private getTechnologiesImages(): void {
    this.firebaseService.getAllFromCollection(FirebaseCollections.technologies)
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: TechnologyItems[]) => {
        this.technologiesImages = [];
        let currentSize = 0;
        const maxSize = 6;
        let currentIndex = 0;
        list.forEach((item, index) => {
          if (currentSize === 0) {
            this.technologiesImages.push([]);
          }

          if (item.iconUrl.length > 1) {
            this.technologiesImages[currentIndex].push(item);
            currentSize++;
            if (currentSize === maxSize || index === list.length - 1) {
              currentIndex++;
              currentSize = 0;
            }
          }
        });
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
