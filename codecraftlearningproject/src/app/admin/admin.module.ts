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


@NgModule({
  declarations: [
    StudentsComponent,
    CreateStudentModalComponent,
    EnquiryComponent,
    PackagesComponent 
   ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoaderComponent,
    DropdownComponent
]
})
export class AdminModule { }
