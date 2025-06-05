import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { lastValueFrom, Subscription } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
import { FirebaseCollections } from '../../constants/commons.enum';
import { IStudent } from '../../interfaces/student.interface';
import { ActivatedRoute } from '@angular/router';
import { IEnquiry } from '../../interfaces/enquiries.interface';
import { CoursePackage } from '../../interfaces/course-package.interface';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit, OnDestroy {
  public createStudentModal: boolean = false;
  public allStudents: IStudent[] = [];
  public selectedStudent?: IStudent;
  private subscriptions: Subscription = new Subscription();
  private courses: CoursePackage[] = [];

  constructor(private firebasseService: FirebaseService, private activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadAllCourses()
    this.loadAllStudents();
    this.loadParams();
  }

  private loadAllCourses() {
    this.subscriptions.add(
      this.firebasseService.getAllFromCollection(FirebaseCollections.coursePackages, 'title').subscribe((courses: CoursePackage[]) => {
        this.courses = courses;
      })
    )
  }

  private loadParams(): void {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params['enquiryId']) {
          this.firebasseService.getFromCollectionById(FirebaseCollections.enquiries, params['enquiryId']).subscribe((enquiry: IEnquiry) => {
            this.openStudent(this.loadStudentWithEnquiry(enquiry));
          });
        }
      })
    );
  }

  private loadStudentWithEnquiry(enquiry: IEnquiry): IStudent {
    const student: any = {
      name: enquiry.fullName,
      age: enquiry.age,
      contact: {
        email: enquiry.email,
        phone: enquiry.contactNumber,
      },

    }
    if (enquiry.packageName === undefined || enquiry.packageName === null) {
      student.course = {
        name: 'CUSTOM',
        technology: enquiry.technologies,
      }
    }
    const course = this.courses.find(course => course.title === enquiry.packageName);
    if (course) {
      student.course = {
        name: course.title,
        defaultDuration: course.durationInMonth,
        technology: course.allTechItems,
        price: course.discountPrice
      };
    }

    return student as IStudent;
  }

  public openStudent(student: IStudent) {
    this.selectedStudent = student;
    this.createStudentModal = true;
  }

  public closeStudentModal(): void {
    this.createStudentModal = false;
    this.selectedStudent = undefined;
  }


  private loadAllStudents(): void {
    this.subscriptions.add(
      this.firebasseService.getAllFromCollection(FirebaseCollections.students, 'id').subscribe((students: any[]) => {
        this.allStudents = students;
      })
    );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptions.unsubscribe();
  }
}
