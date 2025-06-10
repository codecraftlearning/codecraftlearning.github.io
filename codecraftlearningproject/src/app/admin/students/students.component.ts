import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { lastValueFrom, Subscription } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
import { CertificationStatus, CourseStatus, FirebaseCollections } from '../../constants/commons.enum';
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
  public filteredStudents: IStudent[] = [];
  public selectedStudent?: IStudent;
  public courseStatus: string[] = ['', ...Object.values(CourseStatus)];
  public certificationStatus: string[] = ['', ...Object.values(CertificationStatus)];
  private subscriptions: Subscription = new Subscription();
  private courses: CoursePackage[] = [];
  public filterForm: FormGroup;

  constructor(private firebaseService: FirebaseService, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      id: [''],
      name: [''],
      email: [''],
      phone: [''],
      courseName: [''],
      batchName: [''],
      courseStatus: [''],
      certificationStatus: ['']
    });
  }

  public ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadAllCourses()
    this.loadAllStudents();
    this.loadParams();
    this.filterFormChange();
  }

  private filterFormChange() {
    const sub = this.filterForm.valueChanges.subscribe(() => {
      this.filterStudentsOnChange();
    });
    this.subscriptions.add(sub);
  }

  private filterStudentsOnChange() {
    const filters = this.filterForm.value;
    let filteredStudents: IStudent[] = this.allStudents;
    Object.keys(filters).forEach(filterKey => {
      const value = '' + filters[filterKey];
      if (value) {
        switch (filterKey) {
          case 'id':
            filteredStudents = filteredStudents.filter(student => student.id?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'name':
            filteredStudents = filteredStudents.filter(student => student.name?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'email':
            filteredStudents = filteredStudents.filter(student => student.contact.email?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'phone':
            filteredStudents = filteredStudents.filter(student => student.contact.phone?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'courseName':
            filteredStudents = filteredStudents.filter(student => student.course.name?.toLowerCase().startsWith(value.trim().toLowerCase()) || student.course.customName?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'batchName':
            filteredStudents = filteredStudents.filter(student => student.course.batchName?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'courseStatus':
            filteredStudents = filteredStudents.filter(student => student.course.status?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
          case 'certificationStatus':
            filteredStudents = filteredStudents.filter(student => student.course.certification?.certificationStatus?.toLowerCase().startsWith(value.trim().toLowerCase()))
            break;
        }
      }
    });
    this.filteredStudents = filteredStudents;
  }

  private loadAllCourses() {
    this.subscriptions.add(
      this.firebaseService.getAllFromCollection(FirebaseCollections.coursePackages, 'title').subscribe((courses: CoursePackage[]) => {
        this.courses = courses;
      })
    )
  }

  private loadParams(): void {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params['enquiryId']) {
          this.firebaseService.getFromCollectionById(FirebaseCollections.enquiries, params['enquiryId']).subscribe((enquiry: IEnquiry) => {
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
      this.firebaseService.getAllFromCollection(FirebaseCollections.students, 'id').subscribe((students: IStudent[]) => {
        this.allStudents = students.sort((s1, s2) => (s1?.course?.enrollmentDate ?? 1) < (s2?.course?.enrollmentDate ?? 0) ? -1 : 1);
        this.filteredStudents = this.allStudents;
      })
    );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptions.unsubscribe();
  }
}
