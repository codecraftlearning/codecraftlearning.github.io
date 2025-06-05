import { Component, OnInit } from '@angular/core';
import { CoursePackage, CoursePackageTechnology } from '../../interfaces/course-package.interface';
import { FirebaseService } from '../../services/firebase.service';
import { from, Subscription } from 'rxjs';
import { FirebaseCollections } from '../../constants/commons.enum';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-packages',
  standalone: false,
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {

  public loading: boolean = true;
  public packages: CoursePackage[] = [];
  public selectedPackage?: CoursePackage;
  public isOpen: boolean = false;
  private subscription: Subscription = new Subscription();
  public packageForm: FormGroup;
  public availableTechnologies: string[] = [];
  public packageProcessing: boolean = false;
  constructor(private firebaseService: FirebaseService, private fb: FormBuilder) {
    this.packageForm = this.fb.group({
      index: [null, [Validators.required, Validators.min(0)]],
      title: [null, Validators.required],
      description: [null, Validators.required],
      regularPrice: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      durationInMonth: [null, [Validators.required, Validators.min(1)]],
      allTechItems: [[]],
      technologies: this.fb.array([])
    });
  }

  get technologies(): FormArray {
    return this.packageForm.get('technologies') as FormArray;
  }

  public addTechnology(tech?: Partial<CoursePackageTechnology>) {
    this.technologies.push(this.fb.group({
      techs: [[]],
      packages: [[]],
      isPackage: [tech?.isPackage || false],
      combinationBy: [tech?.combinationBy || '']
    }));
  }

  public removeTechnology(index: number) {
    this.technologies.removeAt(index);
  }

  public ngOnInit(): void {
    this.fetchPackages();

  }

  public createNewPackage() {
    this.isOpen = true;
    this.selectedPackage = undefined;
    this.packageForm.reset();
    this.technologies.clear();
    this.packageForm.setControl('technologies', this.fb.array([]));
    this.packageForm.patchValue({
      index: this.packages.length + 1, // Set default index to next available
      title: null,
      description: null,
      regularPrice: null,
      discountPrice: null,
      durationInMonth: null,
      allTechItems: [],
    });
    this.packageForm.updateValueAndValidity();
    this.addTechnology(); // Add at least one technology group
  }

  public viewCourse(course: CoursePackage) {
    this.isOpen = true;
    this.selectedPackage = course;
    this.packageForm.reset();
    this.technologies.clear();

    const technologies = course.technologies || [];
    technologies.forEach((tech: CoursePackageTechnology) => {
      if (tech.isPackage) {
        const currentPackages: any = [];
        tech.name.forEach((pkg: string) => {
          const packageTech = this.packages.find(p => p.title === pkg);
          if (packageTech) {
            currentPackages.push(packageTech);
          }
        });
        this.technologies.push(this.fb.group({
          packages: [currentPackages],
          techs: [[]],
          isPackage: [true],
          combinationBy: [tech.combinationBy || '']
        }));
      } else {
        this.technologies.push(this.fb.group({
          techs: [tech.name],
          packages: [[]],
          isPackage: [false],
          combinationBy: [tech.combinationBy || '']
        }));
      }
    });
    this.packageForm.patchValue({
      index: course.index, // Set default index to next available
      title: course.title,
      description: course.description,
      regularPrice: course.regularPrice,
      discountPrice: course.discountPrice,
      durationInMonth: course.durationInMonth,
      allTechItems: course.allTechItems || [],
      technologies
    });
    this.packageForm.updateValueAndValidity();
  }

  public closeCourse() {
    this.selectedPackage = undefined;
    this.technologies.clear();
    this.isOpen = false;
  }

  public getTechString(tech: AbstractControl): string {
    if (tech.get('isPackage')?.value) {
      return `${tech.get('packages')?.value?.map((t: any) => t.title)?.join(' ' + tech.get('combinationBy')?.value + ' ')}`;
    }
    return `${tech.get('techs')?.value?.join(' ' + tech.get('combinationBy')?.value + ' ')}`;
  }

  public resetTechs(tech: AbstractControl) {
    tech.get('packages')?.setValue([]);
    tech.get('techs')?.setValue([]);
    tech.updateValueAndValidity();
  }

  public deletePackage() {
    if (!this.selectedPackage) {
      return;
    }
    const packageId = this.selectedPackage.id;    
    if (packageId && confirm('Are you sure you want to delete this package?')) {
      this.packageProcessing = true;
      this.subscription.add(
        from(this.firebaseService.deleteData(FirebaseCollections.coursePackages, packageId)).subscribe({
          next: () => {
            window.alert('Package deleted successfully');
            this.selectedPackage = undefined;
            this.technologies.clear();
            this.packageForm.reset();
            this.packageProcessing = false;
            this.isOpen = false;
            this.fetchPackages();
          },
          error: (error) => {
            this.packageProcessing = false;
            window.alert('Error deleting package:');
          }
        })
      );
    }
  }

  public onSubmit() {

    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      return;
    }
    this.packageProcessing = true;
    const formValue = this.packageForm.value;
    const newPackage: CoursePackage = {
      index: formValue.index,
      title: formValue.title,
      description: formValue.description,
      regularPrice: formValue.regularPrice,
      discountPrice: formValue.discountPrice,
      durationInMonth: formValue.durationInMonth,
      allTechItems: formValue.allTechItems || []
    };
    const technologies: CoursePackageTechnology[] = [];
    const allTechItemsSet: Set<string> = new Set<string>();
    formValue.technologies.forEach((tech: any) => {
      if (tech.isPackage) {
        const packageTech: CoursePackageTechnology = {
          name: tech.packages.map((pkg: any) => pkg.title),
          isPackage: true,
          combinationBy: tech.combinationBy,
          iconUrl: []
        };
        tech.packages.forEach((pkg: any) => {
          pkg.allTechItems.forEach((item: string) => {
            allTechItemsSet.add(item);
          });
        });
        technologies.push(packageTech);
      } else {
        const packageTech: CoursePackageTechnology = {
          name: tech.techs,
          isPackage: false,
          combinationBy: tech.combinationBy,
          iconUrl: []
        };
        tech.techs.forEach((item: string) => {
          allTechItemsSet.add(item);
        });
        technologies.push(packageTech);
      }
    });
    newPackage.technologies = technologies;
    newPackage.allTechItems = Array.from(allTechItemsSet);
    this.subscription.add(
      from(this.firebaseService.saveNewData(FirebaseCollections.coursePackages, newPackage)).subscribe({
        next: () => {
          window.alert('Package created successfully');
          this.fetchPackages();
          this.packageProcessing = false;
          this.isOpen = false;
        },
        error: (error) => {
          window.alert('Error creating package:');
          this.packageProcessing = false;
        }
      })
    )
  }

  private loadAllTechnologies(): void {
    const techs: Set<string> = new Set<string>();
    this.packages.forEach((coursePackage: CoursePackage) => {
      coursePackage.allTechItems.forEach((tech) => {
        techs.add(tech);
      });
    });
    this.availableTechnologies = Array.from(techs);
    console.log('Available Technologies:', this.availableTechnologies);

  }

  private fetchPackages() {
    this.loading = true;
    this.subscription.add(
      this.firebaseService.getAllFromCollection(FirebaseCollections.coursePackages).subscribe({
        next: (packages: CoursePackage[]) => {
          this.packages = packages.sort((a, b) => a.index - b.index);
          this.loading = false;
          this.loadAllTechnologies();
        },
        error: (error) => {
          console.error('Error fetching packages:', error);
          this.loading = false;
        }
      })
    );
  }
}
