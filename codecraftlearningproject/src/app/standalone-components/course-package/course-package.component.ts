import { Component, Input, OnInit } from '@angular/core';
import { CoursePackage, CoursePackageTechnology } from '../../interfaces/course-package.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-package',
  standalone : true,
  imports: [
    CommonModule
  ],
  templateUrl: './course-package.component.html',
  styleUrl: './course-package.component.scss'
})
export class CoursePackageComponent implements OnInit {
  @Input()
  public coursePackage!: CoursePackage;

  public techs: CoursePackageTechnology[][] = [];

  public ngOnInit(): void {
    this.createTechConfig();
  }

  private createTechConfig(): void {
    const sortedTechList = this.coursePackage.technologies.sort((t1, t2) => t1.isPackage ? -1 : 1);
    const rows: CoursePackageTechnology[][] = [];
    let currentRow: CoursePackageTechnology[] = [];
    let maxRowSize = 2;

    sortedTechList.forEach((tech, index) => {
      if (tech.isPackage) {
        currentRow.push(tech);
        rows.push(currentRow);
        currentRow = [];
      }
      else {
        currentRow.push(tech);
        if (currentRow.length === maxRowSize || index === sortedTechList.length - 1) {
          rows.push(currentRow);
          currentRow = [];
        }
      }
    });
    this.techs = rows;
  }

  public getName(tech: CoursePackageTechnology): string {
    if (Array.isArray(tech.name)) {
      return tech.name.join(' ' + tech.combinationBy + ' ');
    }
    return tech.name;
  }
  
  public getIconUrl(tech: CoursePackageTechnology): string[] {
    if (Array.isArray(tech.iconUrl)) {
      return tech.iconUrl.map(url => url.length ? ('./../../../assets/tech-images/' + url) : '');
    }
    return [tech.iconUrl.length ? './../../../assets/tech-images/' + tech.iconUrl : ''];
  }

  public getTextStyle(tech: CoursePackageTechnology): string {
    const name = this.getName(tech);
    return (name.length > 25 ? 'text-sm' : name.length > 15 ? 'text-base' : 'text-lg') + (tech.isPackage ? ' underline underline-offset-2' : '');
  }
}
