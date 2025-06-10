import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rating } from '../../interfaces/rating.interface';
import { FirebaseService } from '../../services/firebase.service';
import { FirebaseCollections } from '../../constants/commons.enum';
import { Subscription } from 'rxjs';
import { IStudent } from '../../interfaces/student.interface';
import { IStudentLog } from '../../interfaces/studentLog.interface';

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
  public isExistingStudent: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.reviewForm = this.fb.group({
      studentId: [null],
      emailId: [null],
      name: [null],
      gender: [null],
      courseTitle: [null],
      message: [null, [Validators.required, Validators.minLength(10)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      date: [new Date(), Validators.required]
    });
  }

  public toggleReviewAsExistingStudent() {
    this.isExistingStudent = !this.isExistingStudent;

    if (this.isExistingStudent) {
      this.reviewForm.get('studentId')?.setValidators(Validators.required);
      this.reviewForm.get('emailId')?.setValidators([Validators.required, Validators.email]);
      this.reviewForm.get('name')?.removeValidators(Validators.required);
      this.reviewForm.get('name')?.setErrors(null);
      this.reviewForm.get('gender')?.removeValidators(Validators.required);
      this.reviewForm.get('gender')?.setErrors(null);;
      this.reviewForm.get('courseTitle')?.removeValidators(Validators.required);
      this.reviewForm.get('courseTitle')?.setErrors(null);
    } else {
      this.reviewForm.get('name')?.setValidators(Validators.required);
      this.reviewForm.get('gender')?.setValidators(Validators.required);
      this.reviewForm.get('courseTitle')?.setValidators(Validators.required);
      this.reviewForm.get('studentId')?.removeValidators(Validators.required);
      this.reviewForm.get('studentId')?.setErrors(null);;
      this.reviewForm.get('emailId')?.removeValidators([Validators.required, Validators.email]);
      this.reviewForm.get('emailId')?.setErrors(null);;
    }

    this.reviewForm.updateValueAndValidity();
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
    this.reviewForm.patchValue( {
      date: new Date()
    });
    this.reviewForm.updateValueAndValidity();
    
    if (this.reviewForm.valid) {
      if (this.isExistingStudent) {
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
    const studentId: string = this.reviewForm.get('studentId')?.value?.trim()?.toLowerCase();
    const emailId: string = this.reviewForm.get('emailId')?.value?.trim()?.toLowerCase();
    this.isInvalidStudentId = false;
    this.isInvalidEmailId = false;
    this.subscriptions.add(
      this.firebaseService.getFromCollectionById(FirebaseCollections.studentLog, studentId).subscribe((student: IStudentLog) => {
        if (!!student) {
          if (student.email.toLowerCase() === emailId) {
            this.reviewForm.patchValue({
              name: student.name,
              emailId: student.email,
              courseTitle: student.courseTitle,
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
