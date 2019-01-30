import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  userId: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private http: HttpClient) { 
    this.afAuth.authState.subscribe((auth) => {
      if (auth) this.userId = auth.uid;
    });
  }

  CreatePayment(token: any, amount: number, poolId: string): Promise<any> {
    const payment = { token, amount, poolId };
    return this.db.doc(`/payments/${this.userId}_${poolId}`).set(payment);
  }

}
