import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateSectionComponent } from '../standalone-components/certificate-section/certificate-section.component';
import { CertificateComponent } from '../standalone-components/certificate/certificate.component';
import { CoursePackageComponent } from '../standalone-components/course-package/course-package.component';
import { DropdownComponent } from '../standalone-components/dropdown/dropdown.component';
import { ReviewCardComponent } from '../standalone-components/review-card/review-card.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { AboutComponent } from '../standalone-components/about/about.component';
import { FooterComponent } from '../standalone-components/footer/footer.component';
import { HeaderComponent } from '../standalone-components/header/header.component';
import { LoaderComponent } from '../standalone-components/loader/loader.component';
import { ReviewComponent } from '../standalone-components/review/review.component';
import { TechnologyComponent } from '../standalone-components/technology/technology.component';
import { PageRoutingModule } from './page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimestampPipePipe } from '../pipe/timestamp-pipe.pipe';
import { CollaborationComponent } from './collaboration/collaboration.component';

const firebaseConfig = {
  apiKey: "AIzaSyCbfNfncyea0XyhKQkmzURjXHIkDVC1HbA",
  authDomain: "codecraftlearning-user.firebaseapp.com",
  projectId: "codecraftlearning-user",
  storageBucket: "codecraftlearning-user.firebasestorage.app",
  messagingSenderId: "770678064720",
  appId: "1:770678064720:web:834b435d4c480ab1cc3355"
};


export const standaloneComponents = [
  HeaderComponent,
  AboutComponent,
  TechnologyComponent,
  ReviewComponent,
  CertificateSectionComponent,
  DropdownComponent,
  LoaderComponent,
  CertificateComponent,
  CertificateSectionComponent,
  CoursePackageComponent,
  DropdownComponent,
  ReviewCardComponent
];

@NgModule({
  declarations: [
    HomeComponent,
    CoursesComponent,
    TestimonialsComponent,
    CertificationsComponent,
    CollaborationComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    standaloneComponents,
    TimestampPipePipe
  ],
})
export class PageModule { }
