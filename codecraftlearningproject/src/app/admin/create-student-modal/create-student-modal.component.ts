import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { CoursePackage, CoursePackageTechnology } from '../../interfaces/course-package.interface';
import { CertificationStatus, CertificationType, CourseStatus, FirebaseCollections } from '../../constants/commons.enum';
import { FirebaseService } from '../../services/firebase.service';
import { from, Subscription } from 'rxjs';
import { IStudent, IStudentCourse } from '../../interfaces/student.interface';
import { ICertificate } from '../../interfaces/certificate.interface';
import { IStudentLog } from '../../interfaces/studentLog.interface';
import { IBatch } from '../../interfaces/batch.interface';
import { IConfiguration } from '../../interfaces/configuration.interface';
import emailJs from '@emailjs/browser';
import { IOnboardingEmail } from '../../interfaces/onboarding-email.interface';

@Component({
  selector: 'app-create-student-modal',
  standalone: false,
  templateUrl: './create-student-modal.component.html',
  styleUrl: './create-student-modal.component.scss'
})
export class CreateStudentModalComponent implements OnInit, OnDestroy {

  @Input() public isOpen: boolean = false;
  @Output() public onClose: EventEmitter<void> = new EventEmitter<void>();
  @Input() public set SelectedStudent(student: IStudent | undefined) {
    if (student) {
      this.courses.clear();
      this.studentForm.reset();
      this.isOpen = true;
      this.isEditMode = !!student.id;
      const studentData: any = { ...student };
      studentData.course = studentData.course ? [studentData.course] : [];
      this.studentForm.patchValue(studentData);
      this.addCourse(studentData.course[0]);
      this.studentForm.updateValueAndValidity();
    }
  };

  public isEditMode: boolean = false;
  public courseList: CoursePackage[] = []
  public courseStatusList = Object.values(CourseStatus);
  public certificationStatusList = Object.values(CertificationStatus);
  public certificationTypeList = Object.values(CertificationType);
  public studentForm: FormGroup;
  public creatingStudent: boolean = false;
  public availableBatches: IBatch[] = [];
  public configuration: IConfiguration = {};
  private subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.studentForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
      aadharNumber: [null, [Validators.pattern('^[0-9]{12}$')]], // Assuming Aadhar is a 12-digit number
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        alternatePhone: ['']
      }),
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        country: ['', Validators.required]
      }),
      course: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadConfiguration();
    this.loadAllCourses();
    this.loadAllBatches();
  }

  public get showKycButton(): boolean {
    return !this.studentForm.get('aadharNumber')?.value && this.isEditMode && this.studentForm.get('course')?.value[0]?.status !== CourseStatus.completed;
  }

  private loadConfiguration() {
    this.subscriptions.add(
      this.firebaseService.getAllFromCollection(FirebaseCollections.configurations).subscribe((configurations: IConfiguration[]) => {
        this.configuration = configurations && configurations.length > 0 ? configurations[0] : {};
      })
    )
  }

  public loadAllBatches() {
    this.subscriptions.add(
      this.firebaseService.getAllFromCollection(FirebaseCollections.batches).subscribe((batches: IBatch[]) => {
        this.availableBatches = batches
      })
    );
  }

  public getBatch(batchId?: string): IBatch | null {
    const batch = this.availableBatches.find(b => b.id === batchId);
    return batch ? batch : null;
  }

  public get courses(): FormArray {
    return this.studentForm.get('course') as FormArray;
  }

  public getTechStack(courseGroup: AbstractControl): string[] {
    return courseGroup.get('technology')?.value ?? [];
  }

  public addCourse(course?: any) {
    const courseGroup = this.fb.group({
      batchName: [course?.batchName || null],
      name: [course?.name || '', Validators.required],
      customName: [course?.customName || ''],
      defaultDuration: [course?.defaultDuration || null, Validators.required],
      enrollmentDate: [course?.enrollmentDate || null, Validators.required],
      completionDate: [course?.completionDate || null, this.completionAfterEnrollmentValidator],
      technology: [course?.technology || [], Validators.required],
      price: [course?.price || 0, [Validators.required, Validators.min(0)]],
      instructor: [course?.instructor || '', Validators.required],
      status: [course?.status || CourseStatus.notStarted, Validators.required],
      certification: this.fb.group({
        certificationType: [course?.certification?.certificationType || ''],
        certificationStatus: [course?.certification?.certificationStatus || CertificationStatus.notApplicable, Validators.required],
        certificationDate: [course?.certification?.certificationDate || ''],
        certificateId: [course?.certification?.certificateId || '']
      })
    });
    this.nameValueChanges(courseGroup);
    this.completionDateValueChanges(courseGroup);
    this.batchNameValueChanges(courseGroup);
    if (course) {
      if (course.name?.toLowerCase() === 'custom') {
        courseGroup.get('customName')?.addValidators(Validators.required);
      } else {
        courseGroup.get('customName')?.removeValidators(Validators.required);
        courseGroup.get('customName')?.setErrors(null);
      }
      courseGroup.updateValueAndValidity();
    }

    this.courses.push(courseGroup);
  }

  private nameValueChanges(courseGroup: FormGroup) {
    const sub = courseGroup.controls['name'].valueChanges.subscribe((value: string) => {
      const selectedCourse: CoursePackage | undefined = this.courseList.find(c => c.title === value);
      if (!selectedCourse) {
        return;
      }

      courseGroup.patchValue({
        defaultDuration: selectedCourse.durationInMonth,
        price: selectedCourse.discountPrice,
        technology: selectedCourse.allTechItems || [],
      })

      if (selectedCourse.title.toLowerCase() === 'custom') {
        courseGroup.get('customName')?.addValidators(Validators.required);
      } else {
        courseGroup.get('customName')?.removeValidators(Validators.required);
        courseGroup.get('customName')?.setErrors(null);
      }

      courseGroup.updateValueAndValidity();
    });

    this.subscriptions.add(sub);
  }

  private completionDateValueChanges(courseGroup: FormGroup) {
    const sub = courseGroup.controls['completionDate'].valueChanges.subscribe((value: any) => {
      if (value) {
        courseGroup.patchValue({
          certification: {
            certificationStatus: CertificationStatus.pending
          },
          status: CourseStatus.completed
        });
        courseGroup.get('certification.certificationType')?.setValidators([Validators.required]);
        courseGroup.get('certification.certificationType')?.updateValueAndValidity();
        courseGroup.get('certification.certificationType')?.markAllAsTouched();
      }
    });
    this.subscriptions.add(sub);
  }

  private batchNameValueChanges(courseGroup: FormGroup) {

    const sub = courseGroup.controls['batchName'].valueChanges.subscribe((id: string) => {
      if (courseGroup.controls['status'].value === CourseStatus.notStarted || courseGroup.controls['status'].value === CourseStatus.inProgress) {
        courseGroup.patchValue({
          status: CourseStatus.inProgress,
          instructor: this.getBatch(id)?.instructorName || ''
        });
        courseGroup.updateValueAndValidity();
      }
    });
    this.subscriptions.add(sub);
  }

  public removeTechAt(courseControl: AbstractControl, index: number): void {
    const value: string[] = courseControl.get('technology')?.value ?? [];
    if (value.length === 1) {
      return;
    }
    value.splice(index, 1);
    courseControl.patchValue({
      technology: value
    });
    courseControl.updateValueAndValidity();
  }

  public closeModal() {
    this.isOpen = false;
    this.isEditMode = false;
    this.courses.clear();
    this.studentForm.reset();
    window.history.replaceState({}, document.title, window.location.pathname);
    this.onClose.emit();
  }

  public onSubmit() {
    if (this.studentForm.valid) {
      this.creatingStudent = true;
      const studentSubs: any[] = [];
      this.getFlatStudents().forEach((student: IStudent) => {
        studentSubs.push(this.firebaseService.saveNewData(FirebaseCollections.students, student, student.id));
        this.updateStudentLog(student);
      });
      const sub = from(Promise.all(studentSubs)).subscribe({
        next: () => {
          this.sendOnboardingEmail();
          this.closeModal();
          this.creatingStudent = false;
          window.alert('Student created successfully!');
        }, error: (err) => {
          console.error('Error creating student:', err);
          this.creatingStudent = false;
          window.alert('Failed to create student. Please try again.');
        }
      });
      this.subscriptions.add(sub);
    } else {
      this.studentForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  public getFlatStudents(): IStudent[] {
    const students: IStudent[] = [];
    let count = 0;
    this.studentForm.value.course.forEach((course: any) => {
      ++count
      const student: IStudent = {
        ...this.studentForm.value,
        course: course
      }
      student.id = this.createId() + count; // Generate a unique ID for each student
      students.push(student);
    });

    return students;
  }

  public updateStudent() {
    const studentData = this.studentForm.value;
    studentData.course = studentData.course[0]; // Assuming only one course is selected for edit
    const studentId = studentData.id;
    if (this.studentForm.valid && studentId) {
      this.creatingStudent = true;
      const sub = from(this.firebaseService.updateData(FirebaseCollections.students, studentId, studentData)).subscribe({
        next: () => {
          this.closeModal();
          this.creatingStudent = false;
          window.alert('Student updated successfully!');
          this.updateStudentLog(studentData);
        }, error: (err) => {
          console.error('Error updating student:', err);
          this.creatingStudent = false;
          window.alert('Failed to update student. Please try again.');
        }
      });
      this.subscriptions.add(sub);
    } else {
      this.studentForm.markAllAsTouched();
      console.error('Form is invalid or student ID is missing');
    }
  }

  private updateStudentLog(student: IStudent) {
    const studentLog: IStudentLog = {
      id: student.id ?? '',
      email: student.contact.email,
      name: student.name,
      gender: student.gender ?? '',
      courseTitle: student.course.name === 'CUSTOM' ? (student.course.customName ?? '') : student.course.name
    }
    this.subscriptions.add(
      from(this.firebaseService.saveNewData(FirebaseCollections.studentLog, studentLog, student.id)).subscribe()
    );
  }

  public certifyStudent(): void {
    const student: any = this.studentForm.value;
    if (!student.id || student.course[0].status !== CourseStatus.completed) {
      window.alert('Student is not eligible for certification.');
      return;
    }

    this.subscriptions.add(
      this.firebaseService.getAllFromCollection(FirebaseCollections.reviews).subscribe((reviews: any[]) => {
        if (reviews.findIndex(review => review.studentId === student.id) === -1) {
          window.alert('Student review not submitted. Certification cannot be processed.')
          return;
        }
        (this.studentForm.get('course') as FormArray)?.at(0)?.get('certification')?.patchValue({
          certificationStatus: CertificationStatus.certified,
          certificationDate: new Date().toDateString(),
          certificateId: student.id
        });
        this.studentForm.updateValueAndValidity();
        this.updateStudent();
        this.generateCertificate();
      })
    );
    // Certification logic here
  }

  private generateCertificate(): void {
    const student: IStudent = this.studentForm.value;
    const certificate: any = {
      id: student.id ?? '',
      issuedTo: student.name,
      courseTitle: student.course.name !== 'CUSTOM' ? student.course.name : student.course.customName,
      technologiesCovered: student.course.technology,
      duration: `${student.course.defaultDuration} months`,
      completionDate: student.course.certification?.certificationDate,
      certifiedBy: student.course.instructor ?? '', // This can be dynamic based on the logged-in user
      modeOfLearning: 'Online', // Assuming online for now, can be dynamic
      certificationType: student.course.certification?.certificationType,
      IssuedUnder: 'Code Craft Learning' // This can be dynamic based on the institution
    }
    this.subscriptions.add(
      from(this.firebaseService.saveNewData(FirebaseCollections.certificates, certificate, student.id)).subscribe({
        next: () => {
          console.log('Certificate generated successfully:', certificate);
          window.alert('Certificate generated successfully!');
        },
        error: (err) => {
          console.error('Error generating certificate:', err);
          window.alert('Failed to generate certificate. Please try again.');
        }
      })
    );
  }

  private loadAllCourses() {
    const customCourse: CoursePackage = {
      description: 'Custom Course',
      title: 'CUSTOM',
      index: 0,
      regularPrice: 0,
      discountPrice: 0,
      durationInMonth: 0,
      technologies: [],
      allTechItems: []
    }
    const sub = this.firebaseService.getAllFromCollection(FirebaseCollections.coursePackages).subscribe((courses: CoursePackage[]) => {
      this.courseList = [customCourse, ...courses];
    });
    this.subscriptions.add(sub);
  }

  private createId() {
    const student = this.studentForm.value;
    const prefix = student.name.substring(0, 2).toLowerCase();
    const suffix = Math.random().toString(36).substring(2, 6); // 4 random chars

    return prefix + suffix;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get isReadyToCertify(): boolean {
    if (this.isEditMode) {
      const course = this.studentForm.get('course')?.value[0];
      if (course.status === CourseStatus.completed && course.completionDate) {
        return course.certification.certificationStatus === CertificationStatus.pending;
      }
    }
    return false;
  }

  public get isCertified(): boolean {
    return this.studentForm.get('course')?.value[0]?.certification?.certificationStatus === CertificationStatus.certified;
  }

  private completionAfterEnrollmentValidator(control: any) {
    const parent = control.parent;
    if (!parent) return null;
    const enrollment = parent.get('enrollmentDate')?.value;
    const completion = control.value;
    if (enrollment && completion && new Date(completion) <= new Date(enrollment)) {
      return { completionBeforeEnrollment: true };
    }
    return null;
  }

  public sendOnboardingEmail(): void {
    const student = this.studentForm.value;
    student.course = student.course[0];

    if (!this.configuration.email || !this.configuration.email.serviceId || !this.configuration.email.publicKey) {
      console.warn('Email configuration is not set.');
      return;
    }

    const onboardingEmailData: IOnboardingEmail = {
      studentId: student.id || '',
      studentName: student.name || '',
      email: student.contact.email || '',
      courseTitle: student.course.name === 'CUSTOM' ? (student.course.customName || '') : student.course.name,
      technologiesCovered: student.course.technology.join(', ') || '',
      duration: `${student.course.defaultDuration} months`,
      price: student.course.price ?? 0
    };

    emailJs.send(
      this.configuration.email.serviceId,
      this.configuration.email.onboardingTemplateId,
      onboardingEmailData as any,
      this.configuration.email.publicKey
    ).then(() => {
      window.alert('Onboarding email sent successfully.');
    });
  }
}
