import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoursePackage, CoursePackageTechnology } from '../../interfaces/course-package.interface';
import { CommonModule } from '@angular/common';
import { TECHNOLOGY_IMAGES } from '../../constants/common.constants';

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
  @Output()
  public courseSelected: EventEmitter<CoursePackage> = new EventEmitter<CoursePackage>();
  public icons = TECHNOLOGY_IMAGES;
  public techs: CoursePackageTechnology[][] = [];

  public ngOnInit(): void {
    this.createTechConfig();
  }

  private createTechConfig(): void {
    const sortedTechList = (this.coursePackage as any).technologies.sort((t1: any, t2: any) => t1.isPackage ? -1 : 1);
    const rows: CoursePackageTechnology[][] = [];
    let currentRow: CoursePackageTechnology[] = [];
    let maxRowSize = 2;

    sortedTechList.forEach((tech: any, index: any) => {
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
      return !tech.isPackage && tech.name ? tech.name?.map(n => this.icons[n].url || '') : [];
  }

  public getIconAlt(tech: CoursePackageTechnology): string[] {
    return !tech.isPackage && tech.name ? tech.name?.map(n => this.icons[n].alt || '') : [];
  }

  public getTextStyle(tech: CoursePackageTechnology): string {
    const name = this.getName(tech);
    return (name.length > 25 ? 'text-sm' : name.length > 15 ? 'text-base' : 'text-lg') + (tech.isPackage ? ' underline underline-offset-2' : '');
  }

  public selectPackage(): void {
    this.courseSelected.emit(this.coursePackage);
  }
}
