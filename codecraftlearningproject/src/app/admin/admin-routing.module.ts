import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { adminGuard } from './guard/admin.guard';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { PackagesComponent } from './packages/packages.component';
import { BatchComponent } from './batch/batch.component';

const routes: Routes = [
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'enquiries',
    component: EnquiryComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'packages',
    component: PackagesComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'batches',
    component: BatchComponent,
    canActivate: [adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
