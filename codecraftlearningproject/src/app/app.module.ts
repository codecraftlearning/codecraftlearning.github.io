import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './standalone-components/header/header.component';
import { FooterComponent } from './standalone-components/footer/footer.component';

const firebaseConfig = {
  apiKey: "AIzaSyCbfNfncyea0XyhKQkmzURjXHIkDVC1HbA",
  authDomain: "codecraftlearning-user.firebaseapp.com",
  projectId: "codecraftlearning-user",
  storageBucket: "codecraftlearning-user.firebasestorage.app",
  messagingSenderId: "770678064720",
  appId: "1:770678064720:web:834b435d4c480ab1cc3355"
};


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
     FooterComponent,
     HeaderComponent
],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

