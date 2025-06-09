import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rating } from '../../interfaces/rating.interface';
import { FirebaseService } from '../../services/firebase.service';
import { FirebaseCollections } from '../../constants/commons.enum';
import { Subscription } from 'rxjs';
import { IStudent } from '../../interfaces/student.interface';

@Component({
  selector: 'app-testimonials',
  standalone: false,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit, OnDestroy {

  public addReview: boolean = false;
  public reviewForm: FormGroup;
  public reviewSubmitting: boolean = false;
  public pageLoading: boolean = false;
  public reviews: Rating[] = [];
  public isInvalidStudentId: boolean = false;
  public isInvalidEmailId: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.reviewForm = this.fb.group({
      existingStudent: [false],
      studentId: ['', []],
      emailId: ['', []],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      courseTitle: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      date: [new Date(), Validators.required]
    });

    // Listen for changes to existingStudent and update validators accordingly
    this.reviewForm.get('existingStudent')?.valueChanges.subscribe((isExisting: boolean) => {
      const studentIdCtrl = this.reviewForm.get('studentId');
      const emailIdCtrl = this.reviewForm.get('emailId');
      const nameCtrl = this.reviewForm.get('name');
      const genderCtrl = this.reviewForm.get('gender');
      const courseTitleCtrl = this.reviewForm.get('courseTitle');

      if (isExisting) {
        studentIdCtrl?.setValidators([Validators.required]);
        emailIdCtrl?.setValidators([Validators.required, Validators.email]);
        nameCtrl?.clearValidators();
        genderCtrl?.clearValidators();
        courseTitleCtrl?.clearValidators();
      } else {
        studentIdCtrl?.clearValidators();
        emailIdCtrl?.clearValidators();
        nameCtrl?.setValidators([Validators.required]);
        genderCtrl?.setValidators([Validators.required]);
        courseTitleCtrl?.setValidators([Validators.required]);
      }

      studentIdCtrl?.updateValueAndValidity();
      emailIdCtrl?.updateValueAndValidity();
      nameCtrl?.updateValueAndValidity();
      genderCtrl?.updateValueAndValidity();
      courseTitleCtrl?.updateValueAndValidity();
    });

    // Trigger initial validation
    this.reviewForm.get('existingStudent')?.updateValueAndValidity({ emitEvent: true });

    // Update validators based on existingStudent value
    this.reviewForm.get('existingStudent')?.valueChanges.subscribe((isExisting: boolean) => {
      const nameCtrl = this.reviewForm.get('name');
      const genderCtrl = this.reviewForm.get('gender');
      const courseTitleCtrl = this.reviewForm.get('courseTitle');

      if (isExisting) {
        nameCtrl?.clearValidators();
        genderCtrl?.clearValidators();
        courseTitleCtrl?.clearValidators();
      } else {
        nameCtrl?.setValidators([Validators.required]);
        genderCtrl?.setValidators([Validators.required]);
        courseTitleCtrl?.setValidators([Validators.required]);
      }

      nameCtrl?.updateValueAndValidity();
      genderCtrl?.updateValueAndValidity();
      courseTitleCtrl?.updateValueAndValidity();
    });
  }

  public ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.pageLoading = true;
    const sub = this.firebaseService.getAllFromCollection(FirebaseCollections.reviews).subscribe((data: Rating[]) => {
      this.reviews = data.sort((d1, d2) => d1.date < d2.date ? 1 : -1);
      this.pageLoading = false;
    }, (error: any) => {
      console.error('Error loading reviews:', error);
      this.pageLoading = false;
    });
    this.subscriptions.add(sub);
  }

  public onSubmit(): void {
    if (this.reviewForm.valid) {
      if (this.reviewForm.get('existingStudent')?.value) {
        this.validateStudent();
      } else {
        this.submitDefaultReview();
      }
    } else {
      this.reviewForm.markAllAsTouched();
    }
  }

  private submitDefaultReview(): void {
    this.reviewSubmitting = true;
    this.firebaseService.saveNewData(FirebaseCollections.reviews, this.reviewForm.value).then(() => {
      this.reviewForm.reset();
      this.reviewSubmitting = false;
      this.addReview = false;
    }).catch((error: any) => {
      this.reviewForm.reset();
      this.reviewSubmitting = false;
    });
  }

  private validateStudent() {
    const studentId = this.reviewForm.get('studentId')?.value?.trim();
    const emailId = this.reviewForm.get('emailId')?.value?.trim();
    this.isInvalidStudentId = false;
    this.isInvalidEmailId = false;
    this.subscriptions.add(
      this.firebaseService.getFromCollectionById(FirebaseCollections.students, studentId).subscribe((student: IStudent) => {
        if (!!student) {
          if (student.contact.email === emailId) {
            this.reviewForm.patchValue({
              name: student.name,
              emailId: student.contact.email,
              courseTitle: student.course.name,
              gender: student.gender,
            });
            this.reviewForm.updateValueAndValidity();
            this.isInvalidStudentId = false;
            this.isInvalidEmailId = false;
            this.submitDefaultReview();
          } else {
            this.isInvalidEmailId = true;
          }
        } else {
          this.isInvalidStudentId = true;
        }
      }));
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
