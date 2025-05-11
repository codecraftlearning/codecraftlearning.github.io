import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HeaderComponent } from './standalone-components/header/header.component';
import { AboutComponent } from './standalone-components/about/about.component';
import { TechnologyComponent } from "./standalone-components/technology/technology.component";
import { FooterComponent } from './standalone-components/footer/footer.component';
import { ReviewComponent } from './standalone-components/review/review.component';
import { CertificateComponent } from "./standalone-components/certificate/certificate.component";
import { CertificateSectionComponent } from "./standalone-components/certificate-section/certificate-section.component";
import { HomeComponent } from './page/home/home.component';
import { CoursesComponent } from './page/courses/courses.component';
import { TestimonialsComponent } from './page/testimonials/testimonials.component';
import { CertificationsComponent } from './page/certifications/certifications.component';
import { CoursePackageComponent } from "./standalone-components/course-package/course-package.component";

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
  FooterComponent
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoursesComponent,
    TestimonialsComponent,
    CertificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    standaloneComponents,
    CertificateComponent,
    CertificateSectionComponent,
    CoursePackageComponent
],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

