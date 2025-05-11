import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoursePackage } from '../../interfaces/course-package.interface';
import { FirebaseService } from '../../services/firebase.service';
import { FirebaseCollections } from '../../constants/commons.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit, OnDestroy {

  public coursePackages: CoursePackage[] = []
  private subscriptions: Subscription = new Subscription();

  public constructor(private firebaseService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.loadAllCoursePackages();
  }

  private loadAllCoursePackages(): void {
    const sub = this.firebaseService.getAllFromCollection(FirebaseCollections.coursePackages).subscribe((coursePackages: CoursePackage[]) => {
      this.coursePackages = coursePackages.sort((a, b) => a.index - b.index);
      console.log(coursePackages);
      
    });
    this.subscriptions.add(sub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  } 
}
