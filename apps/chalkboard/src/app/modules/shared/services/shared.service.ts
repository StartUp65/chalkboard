import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Cords } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private afs: AngularFirestore) {}

  public setChalkboardCords(cords: Cords): void {
    this.afs.doc(`chalkboard/default`).set(JSON.parse(JSON.stringify(cords)));
  }

  public getChalkboardCords(): Observable<Cords> {
    return this.afs.doc<Cords>(`chalkboard/default`).valueChanges();
  }

  public setChalkboardRecording(cords: any[]): void {
    this.afs.doc(`chalkboard/recording`).set({ cords });
  }

  public getChalkboardRecording(): Observable<any> {
    return this.afs.doc<Cords>(`chalkboard/recording`).valueChanges();
  }
}
