import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService, User } from 'src/app/core/auth.service';
import { Observable } from 'rxjs';
import { map, first, last } from 'rxjs/operators';
import { AngularFirestore, DocumentReference, AngularFirestoreDocument } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/payments/payment.service';
declare const StripeCheckout: any;

export interface pool {
  id: string;
  poolName: string;
  users: DocumentReference[];
  poolEntryFee: number;
}

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {

  private handler: any;

  private amount: number = 0;

  private user: User;

  private pools$: Observable<any>;

  constructor(private auth: AuthService, private db: AngularFirestore, private paymentSvc: PaymentService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);

    this.pools$ = this.db.collection<pool>(`/pool`).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as pool;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: token => {
        this.paymentSvc.CreatePayment(token, this.amount, this.poolId);
      }
    });
  }

  poolData: pool;
  userDocReference: DocumentReference;
  pool: AngularFirestoreDocument<pool>;
  poolId: string;
  joinPool(poolId: string) {
    this.poolId = poolId;
    this.pool = this.db.doc<pool>(`/pool/${poolId}`);
    this.pool.valueChanges().pipe(first()).subscribe(d => {
      this.poolData = d;
      this.userDocReference = this.db.doc(`/users/${this.user.uid}`).ref;
      let userInData = false;
      for (let ref of this.poolData.users) {
        if (ref.id === this.userDocReference.id) {
          console.log('User Already In Pool.');
          userInData = true;
        }
      }
      if (this.poolData.users === null || !userInData) {
        this.amount = this.poolData.poolEntryFee;
        this.handlePayment();
      }
    });
  }

  handlePayment() {
    this.handler.open({
      name: 'Game of Thrones Game',
      amount: this.amount
    });
  }

  @HostListener('window:popstate')
  onpopstate() {
    this.handler.close()
  }

}
