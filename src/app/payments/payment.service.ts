import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  userId: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { 
    this.afAuth.authState.subscribe((auth) => {
      if (auth) this.userId = auth.uid;
    });
  }

  processPayment(token: any, amount: number) {
    const payment = { token, amount };
    return this.db.doc(`/payments/${this.userId}`).set(payment);
  }

}
