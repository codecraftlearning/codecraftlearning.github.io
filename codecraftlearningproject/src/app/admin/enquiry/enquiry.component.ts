import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { IEnquiry } from '../../interfaces/enquiries.interface';
import { from, Subscription } from 'rxjs';
import { EnquiryStatus, FirebaseCollections } from '../../constants/commons.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry',
  standalone: false,
  templateUrl: './enquiry.component.html',
  styleUrl: './enquiry.component.scss'
})
export class EnquiryComponent implements OnInit, OnDestroy {


  public loading: boolean = false;
  public enquiries: IEnquiry[] = [];
  public enquiryStatus = Object.values(EnquiryStatus);
  public selectedStatuses = {
    [EnquiryStatus.pending]: true,
    [EnquiryStatus.confirmed]: true,
    [EnquiryStatus.cancelled]: true,
    [EnquiryStatus.contacted]: true
  }
  private subscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService, private router: Router) { }


  public ngOnInit(): void {
    this.getEnquiries();
  }

  public get filteredEnquiries(): IEnquiry[] {
    return this.enquiries.filter(enquiry => {
      return this.selectedStatuses[enquiry.status || EnquiryStatus.pending];
    });
  }

  public removeEnquiry(enquiry: IEnquiry): void {
    if (!enquiry || !enquiry.id) {
      console.error('Invalid enquiry data:', enquiry);
      return;
    }
    if (confirm(`Are you sure you want to delete the enquiry from ${enquiry.fullName}?`)) {
      this.loading = true;
      const sub = from(this.firebaseService.deleteData(FirebaseCollections.enquiries, enquiry.id)).subscribe(() => {
        this.enquiries = this.enquiries.filter(e => e.id !== enquiry.id);
        this.loading = false;
      }
        , (error) => {
          console.error('Error deleting enquiry:', error);
          this.loading = false;
        });
      this.subscription.add(sub);
    }
  }

  public cancelEnquiry(enquiry: IEnquiry) {
    let message = window.prompt('Reason for cancellation:');
    if (!message) {
      window.alert('Cancellation reason is required.');
      return;
    }
    enquiry.notes = message;
    enquiry.status = EnquiryStatus.cancelled;
    this.updateEnquiry(enquiry);
  }

  public viewEnquiry(enquiry: IEnquiry) {
    let message = window.prompt('Message / updates:');
    if (!message) {
      window.alert('message is required.');
      return;
    }
    enquiry.notes = message;
    enquiry.status = EnquiryStatus.contacted;
    this.updateEnquiry(enquiry);
  }

  public confirmEnquiry(enquiry: any) {
    if (window.confirm(`Are you sure you want to confirm the enquiry from ${enquiry.fullName}?`)) {
      enquiry.status = EnquiryStatus.confirmed;
      this.updateEnquiry(enquiry);
      this.router.navigate(['/admin/students'], { queryParams: { enquiryId: enquiry.id } });
    }
  }

  private updateEnquiry(enquiry: IEnquiry): void {
    if (!enquiry || !enquiry.id) {
      console.error('Invalid enquiry data:', enquiry);
      return;
    }
    this.loading = true;
    const sub = from(this.firebaseService.updateData(FirebaseCollections.enquiries, enquiry.id, enquiry)).subscribe(() => {
      const index = this.enquiries.findIndex(e => e.id === enquiry.id);
      if (index !== -1) {
        this.enquiries[index] = enquiry; // Update the existing enquiry
      }
      this.loading = false;
    }, (error) => {
      console.error('Error updating enquiry:', error);
      this.loading = false;
    });
    this.subscription.add(sub);
  }

  private getEnquiries(): void {
    this.loading = true;
    const sub = this.firebaseService.getAllFromCollection(FirebaseCollections.enquiries, 'id').subscribe((enquiries: IEnquiry[]) => {
      this.enquiries = enquiries;
      this.loading = false;
    }, (error) => {
      console.error('Error fetching enquiries:', error);
      this.loading = false;
    });
    this.subscription.add(sub);
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
