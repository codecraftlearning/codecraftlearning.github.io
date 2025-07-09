import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirebaseCollections } from '../../constants/commons.enum';
import { TechnologyItems } from '../../interfaces/technology-items';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-technology',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent {

  public technologiesImages: TechnologyItems[][] = [];

  constructor(private firebaseService: FirebaseService) {
    this.getTechnologiesImages()
  }

  private getTechnologiesImages(): void {
    this.firebaseService.getAllFromCollection(FirebaseCollections.technologies).subscribe((list: TechnologyItems[]) => {
      let currentSize = 0;
      const maxSize = 6;
      let currentIndex = 0;
      list.forEach((item, index) => {
        if (currentSize === 0) {
          this.technologiesImages.push([]);
        }
        this.technologiesImages[currentIndex].push(item);
        currentSize++;
        if (currentSize === maxSize || index === list.length - 1) {
          currentIndex++;
          currentSize = 0;
        }
      });
    })
  }
}
