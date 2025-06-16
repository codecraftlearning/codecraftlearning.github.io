import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { StudentsComponent } from './students/students.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateStudentModalComponent } from './create-student-modal/create-student-modal.component';
import { LoaderComponent } from "../standalone-components/loader/loader.component";
import { EnquiryComponent } from './enquiry/enquiry.component';
import { PackagesComponent } from './packages/packages.component';
import { DropdownComponent } from '../standalone-components/dropdown/dropdown.component';
import { TimestampPipePipe } from "../pipe/timestamp-pipe.pipe";
import { BatchComponent } from './batch/batch.component';


@NgModule({
  declarations: [
    StudentsComponent,
    CreateStudentModalComponent,
    EnquiryComponent,
    PackagesComponent,
    BatchComponent 
   ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoaderComponent,
    DropdownComponent,
    TimestampPipePipe
]
})
export class AdminModule { }
