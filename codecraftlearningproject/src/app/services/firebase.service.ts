import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom, Observable } from 'rxjs';
import { FirebaseCollections } from '../constants/commons.enum';
import { collection, collectionData, doc, getDocs, limit, orderBy, query, setDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private currentUserData?: {id: string};
    constructor(
        public firestore: AngularFirestore,
    ) { }

   
    public async saveNewData(collectionName: FirebaseCollections, data: any, id?: string): Promise<any> {
        const user = getAuth().currentUser;
        this.currentUserData = {id: user?.uid || ''};
        const ref = doc(this.firestore.firestore, collectionName, id || this.firestore.createId());
        return setDoc(ref, { ...data, id: ref.id }, { merge: true }, );
    }

    public getAllFromCollection(collectionName: FirebaseCollections, idFieldName?: string): Observable<any[]> {
        const ref = collection(this.firestore.firestore, collectionName);
        if (!idFieldName) {
            return collectionData(ref);
        }
        return collectionData(query(ref, orderBy(idFieldName)), { idField: 'id' });
    }

    public getAllFromCollectionWithMaxItems(collectionName: FirebaseCollections, maxItems: number): Observable<any[]> {
        const q = query(collection(this.firestore.firestore, collectionName), limit(maxItems));
        return collectionData(q, { idField: 'id' })
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

    public generateId(): string {
      return this.firestore.createId();
    }
}