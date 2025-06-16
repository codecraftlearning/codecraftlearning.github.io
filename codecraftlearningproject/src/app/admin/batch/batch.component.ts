import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BatchStatus, FirebaseCollections, WeekDays } from '../../constants/commons.enum';
import { IBatch } from '../../interfaces/batch.interface';
import { FirebaseService } from '../../services/firebase.service';
import { from, Subscription } from 'rxjs';
import { IStudent } from '../../interfaces/student.interface';

@Component({
  selector: 'app-batch',
  standalone: false,
  templateUrl: './batch.component.html',
  styleUrl: './batch.component.scss'
})
export class BatchComponent implements OnInit, OnDestroy {

  public batchForm: FormGroup;
  public showModal: boolean = false;
  public weekDays = Object.values(WeekDays);
  public selectedBatch?: IBatch;
  public batches: IBatch[] = [];
  public students: IStudent[] = []; 
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private fireBaseService: FirebaseService) { // Replace 'any' with your actual Firebase service type
    this.batchForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      status: [null],
      instructorName: ['', Validators.required],
      weeklySchedule: this.fb.array([
      this.fb.group({
        day: [null, Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required]
      }, {
        validators: (group: FormGroup) => {
        const start = group.get('startTime')?.value;
        const end = group.get('endTime')?.value;
        if (start && end && end < start) {
          return { endTimeBeforeStartTime: true };
        }
        return null;
        }
      })
      ]),
      description: ['']
    }, {
      validators: (group: FormGroup) => {
      const start = group.get('startDate')?.value;
      const end = group.get('endDate')?.value;
      if (start && end && new Date(end) < new Date(start)) {
        return { endDateBeforeStartDate: true };
      }
      return null;
      }
    });
    this.setStartDateChanges(); // Set up the listener for start date changes
  }

  public setStartDateChanges() {
    this.subscription.add(
      this.batchForm.get('startDate')?.valueChanges.subscribe(() => {
        this.batchForm.patchValue({
          status: this.calculateBatchStatus() // Update status based on start date changes
        });
        this.batchForm.updateValueAndValidity(); // Ensure the form is valid after changes
      }
      ));
  }

  private calculateBatchStatus(): BatchStatus {
    const startDate = this.batchForm.get('startDate')?.value;
    const endDate = this.batchForm.get('endDate')?.value;
    const currentDate = new Date();

    if (startDate && currentDate < new Date(startDate)) {
      return BatchStatus.notStarted; // Batch has not started yet
    } else if (endDate && currentDate > new Date(endDate)) {
      return BatchStatus.completed; // Batch has completed
    } else {
      return BatchStatus.inProgress; // Batch is currently in progress
    }
  }

  public ngOnInit(): void {
    this.fetchBatches(); // Fetch batches on component initialization
    this.loadAllStudents();
  }

  private loadAllStudents(): void {
    this.subscription.add(
      this.fireBaseService.getAllFromCollection(FirebaseCollections.students).subscribe({
        next: (students) => {
          this.students = students || [];
          this.batches.forEach(batch => {
            batch.strength = this.getBatchStrength(batch.id);
          });
        },
        error: (error) => {
          console.error('Error fetching students:', error);
        }
      })
    );
  }

  public getBatchStrength(batchId: string): number {
    let count = 0;
    this.students.forEach(student => {
      if (student.course.batchName === batchId) {
        count++;
      }
    });
    return count;
  }

  private fetchBatches(): void {
    this.subscription.add(
      this.fireBaseService.getAllFromCollection(FirebaseCollections.batches).subscribe({
        next: (batches) => {
          this.batches = batches || [];
          
        },
        error: (error) => {
          console.error('Error fetching batches:', error);
        }
      })
    );
  }

  get weeklySchedule(): FormArray {
    return this.batchForm.get('weeklySchedule') as FormArray;
  }

  addSchedule(schedule: { day: WeekDays | null; startTime: string; endTime: string } = { day: null, startTime: '', endTime: '' }): void {
    this.weeklySchedule.push(
      this.fb.group({
        day: [schedule?.day ?? null, Validators.required],
        startTime: [schedule?.startTime ?? '', Validators.required],
        endTime: [schedule?.endTime ?? '', Validators.required],
      })
    );
  }

  removeSchedule(index: number) {
    this.weeklySchedule.removeAt(index);
  }

  onSubmit(): void {
    if (this.batchForm.valid) {
      const batchData: IBatch = {
        ...this.batchForm.value,
        id: this.batchForm.value.id || this.fireBaseService.generateId(), // Generate ID if not provided
      };

      if (this.selectedBatch) {
        this.subscription.add(
          from(this.fireBaseService.updateData(FirebaseCollections.batches, this.selectedBatch.id, batchData)).subscribe({
            next: (response) => {
              window.alert('Batch updated successfully');
            },
            error: (error) => {
              window.alert('Failed to update batch');
            }
          }
          ));
      } else {
        this.subscription.add(
          from(this.fireBaseService.saveNewData(FirebaseCollections.batches, batchData)).subscribe({
            next: (response) => {
              window.alert('Batch added successfully');
            },
            error: (error) => {
              window.alert('Failed to add batch');
            }
          })
        )
      }
      this.showModal = false; // Close the modal after submission
    } else {
      this.batchForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
    }
  }

  openBatchModal(): void {
    this.showModal = true;
    this.batchForm.reset(); // Reset the form when opening the modal
  }

  openBatch(batch: IBatch): void {
    this.selectedBatch = batch;
    this.batchForm.patchValue(batch); // Populate the form with the selected batch data
    this.weeklySchedule.clear(); // Clear existing schedules in the form
    batch.weeklySchedule.forEach(schedule => {
      this.addSchedule(schedule); // Add existing schedules to the form
    });
    this.batchForm.updateValueAndValidity(); // Ensure the form is valid
    this.showModal = true; // Open the modal
  }

  public getFormattedSchedule(schedule: { day: WeekDays | null; startTime: string; endTime: string }[]): string[] {
    return schedule.map(item => `${item.day} (${item.startTime} - ${item.endTime})`);
  }

  public removeBatch(): void {
    if (!this.selectedBatch) {
      return;
    }
    if (confirm(`Are you sure you want to delete the batch: ${this.selectedBatch?.name}?`)) {
      this.subscription.add(
        from(this.fireBaseService.deleteData(FirebaseCollections.batches, this.selectedBatch?.id)).subscribe({
          next: () => {
            window.alert('Batch deleted successfully');
            this.fetchBatches(); // Refresh the list after deletion
            this.selectedBatch = undefined; // Clear the selected batch
            this.showModal = false; // Close the modal after deletion
          },
          error: (error) => {
            window.alert('Failed to delete batch');
          }
        })
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions to prevent memory leaks
    this.selectedBatch = undefined; // Clear the selected batch when component is destroyed
    this.showModal = false; // Ensure modal is closed when component is destroyed
  }
}
