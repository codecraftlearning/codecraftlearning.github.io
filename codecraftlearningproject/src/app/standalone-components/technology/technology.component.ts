import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TECHNOLOGY_IMAGES } from '../../constants/common.constants';

@Component({
  selector: 'app-technology',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent {

  public technologiesImages: { url: string; alt: string }[][] = [];

  constructor() {
    this.getTechnologiesImages()
  }
  
  private getTechnologiesImages(): void {
    const list = Object.keys(TECHNOLOGY_IMAGES);
    let currentSize = 0;
    const maxSize = 6;
    let currentIndex = 0;
    list.forEach((key, index) => {
      if (currentSize === 0) {
        this.technologiesImages.push([]);
      }
      this.technologiesImages[currentIndex].push(TECHNOLOGY_IMAGES[key]);
      currentSize++;
      if (currentSize === maxSize || index === list.length - 1) {
        currentIndex++;
        currentSize = 0;
      }
    }); 
  }
}
