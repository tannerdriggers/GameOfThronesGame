import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { pool } from '../main/pool/pool.component';

import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService implements OnInit {

  userId: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private http: HttpClient) { 
    this.afAuth.authState.subscribe((auth) => {
      if (auth) this.userId = auth.uid;
    });
  }

  ngOnInit(): void {
  }

  CreatePayment(token: any, amount: number, poolId: string) {
    const payment = { token, amount, poolId };
    this.db.doc(`/payments/${this.userId}_${poolId}`).set(payment);
    let pool = this.db.doc<pool>(`/pool/${poolId}`);
    pool.valueChanges().pipe(first()).subscribe(p => {
      let users = p.users;
      users.push(this.db.doc(`/users/${this.userId}`).ref);
      pool.update({ users: users })
    });
  }

}
