import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnquiryStatus, FirebaseCollections } from '../../constants/commons.enum';
import { CoursePackage } from '../../interfaces/course-package.interface';
import { IEnquiry } from '../../interfaces/enquiries.interface';
import { FirebaseService } from '../../services/firebase.service';
import { TechnologyItems } from '../../interfaces/technology-items';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit, OnDestroy {

  public coursePackages: CoursePackage[] = []
  private subscriptions: Subscription = new Subscription();
  public availableTechnologies: TechnologyItems[] = [];

  public studentForm: FormGroup;

  public pageLoading: boolean = false;
  public submittingForm: boolean = false;
  public formSubmitted: boolean = false;
  public formErrors: boolean = false;

  public constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) {
    this.studentForm = this.formBuilder.group({
      id: [null],
      fullName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(1)]],
      contactNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      packageName: [null],
      technologies: [[]],
      enquiryPrice: [null]
    }, {
      validators: (formGroup) => {
        const packageName = formGroup.get('packageName')?.value;
        const technologies = formGroup.get('technologies')?.value;
        if (!packageName && (!technologies || technologies.length === 0)) {
          return { packageOrTechnologiesRequired: true };
        }
        return null;
      }
    });
    this.changeActions();
  }

  public onSubmit(): void {
    if (this.studentForm.valid) {

      this.submittingForm = true;
      const formValue: IEnquiry = this.studentForm.value;
      formValue.id = this.firebaseService.generateId();
      formValue.createdDate = new Date();
      formValue.status = EnquiryStatus.pending; // Default status for new enquiries
      formValue.notes = ''; // Initialize notes as an empty string
      this.firebaseService.saveNewData(FirebaseCollections.enquiries, formValue, formValue.id).then(() => {
        this.studentForm.reset();
        this.submittingForm = false;
        this.formSubmitted = true;
        this.formErrors = false;
      }).catch((error: any) => {
        this.submittingForm = false;
        this.formErrors = true;
        this.formSubmitted = false;
      });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  public ngOnInit(): void {
    this.loadAllCoursePackages();
  }

  public packageSelected(coursePackage: CoursePackage): void {
    this.studentForm.patchValue({
      packageName: coursePackage.title,
      technologies: [],
      enquiryPrice: coursePackage?.discountPrice ? coursePackage.discountPrice : coursePackage.regularPrice ?? 0
    });
    this.studentForm.updateValueAndValidity();
    this.scrollTo('registrationForm');
  }

  public scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public retryRegistration(): void {
    this.formSubmitted = false;
    this.formErrors = false;
    this.studentForm.reset();
  }

  private loadAllCoursePackages(): void {
    this.pageLoading = true;
    const sub = this.firebaseService.getAllFromCollection(FirebaseCollections.coursePackages).subscribe((coursePackages: CoursePackage[]) => {
      this.coursePackages = coursePackages.sort((a, b) => a.index - b.index);
      this.loadAllTechnologies();
      this.pageLoading = false;
      this.checkFragment();
    });
    this.subscriptions.add(sub);
  }

  private checkFragment(): void {
    const fragment = window.location.hash.substring(1);
    if (fragment) {
      setTimeout(() => {
        this.scrollTo(fragment);
      }, 10);
    }
  }

  private loadAllTechnologies(): void {
    this.firebaseService.getAllFromCollection(FirebaseCollections.technologies).subscribe((tech: TechnologyItems[]) => {
      this.availableTechnologies = Array.from(tech);
    });
  }

  private changeActions(): void {
    const sub1 = this.studentForm.get('technologies')?.valueChanges.subscribe((value) => {
      if (value && value.length > 0) {
        this.studentForm.get('packageName')?.setValue(null);
      }
    });

    const sub2 = this.studentForm.get('packageName')?.valueChanges.subscribe((value) => {
      if (value) {
        this.studentForm.get('technologies')?.setValue([]);
      }
    });

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
