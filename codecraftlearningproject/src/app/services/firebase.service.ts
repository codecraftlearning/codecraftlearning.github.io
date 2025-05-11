import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom, Observable } from 'rxjs';
import { FirebaseCollections } from '../constants/commons.enum';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    constructor(
        public firestore: AngularFirestore,
    ) {}

   
    public async saveNewData(collectionName: FirebaseCollections, data: any): Promise<any> {
        // const snapshot = await lastValueFrom(this.firestore.collection(collectionName).get());
        // if (snapshot.empty) {
        //     console.log("No matching documents.");
        // }
        return this.firestore.collection(collectionName).add(data).then(() => {
            return data;
        }).catch((error) => {
            console.error("Error adding document: ", error);
            throw error;
        });
    }

    public getAllFromCollection(collectionName: FirebaseCollections): Observable<any[]> {
        return this.firestore.collection(collectionName).valueChanges();
    }

    public getFromCollectionById(collectionName: FirebaseCollections, id: string): Observable<any> {
        return this.firestore.collection(collectionName).doc(id).valueChanges();
    }

    public updateData(collectionName: FirebaseCollections, id: string, data: any): Promise<void> {
        return this.firestore.collection(collectionName).doc(id).update(data).then(() => {
            console.log("Document successfully updated!");
        }).catch((error) => {
            console.error("Error updating document: ", error);
            throw error;
        });
    }
    
    public deleteData(collectionName: FirebaseCollections, id: string): Promise<void> {
        return this.firestore.collection(collectionName).doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error deleting document: ", error);
            throw error;
        });
    }
}