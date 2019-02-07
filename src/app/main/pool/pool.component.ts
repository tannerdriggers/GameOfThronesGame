import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService, User } from 'src/app/core/auth.service';
import { Observable, of } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFirestore, DocumentReference, AngularFirestoreDocument } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/payments/payment.service';
import { Router } from '@angular/router';
import { PayPalConfig, PayPalIntegrationType, PayPalEnvironment } from 'ngx-paypal';
declare const StripeCheckout: any;

export interface pool {
  CreatedBy: DocumentReference;
  CreatedOn: Date;
  finished: boolean;
  poolName: string;
  users: DocumentReference[];
  poolEntryFee: number;
  winnersPaid: boolean;
}

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {

  private handler: any;

  private amount: number = 0;
  private payPalConfig: PayPalConfig;

  private user: User;

  private pools$: Observable<pool[]>;
  private userPools$: Observable<pool[]>;
  private usersPools: pool[];

  private loading: boolean;

  constructor(private auth: AuthService, private db: AngularFirestore, private paymentSvc: PaymentService, private router: Router) {
    this.loading = false;
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.userDocReference = this.db.doc(`/users/${this.user.uid}`).ref;
        this.userPools$ = this.db.collection<pool>(`/pool`, ref => ref.where('users', 'array-contains', this.userDocReference)).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as pool;
              const id = a.payload.doc.id;
              const numUsers = data.users.length;
              return { id, numUsers, ...data };
            });
          })
        )
        this.pools$ = this.db.collection<pool>(`/pool`)
          .snapshotChanges()
          .pipe(
            map(actions => {
              return actions.map(a => {
                const data = a.payload.doc.data() as pool;
                const id = a.payload.doc.id;
                const numUsers: number = data.users.length;
                return { id, numUsers, ...data };
              });
            })
          );
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
      let userInData = false;
      for (let ref of this.poolData.users) {
        if (ref.id === this.userDocReference.id) {
          console.log('User Already In Pool.');
          userInData = true;
          this.EnterPool(poolId);
        }
      }
      if (this.poolData.users === null || !userInData) {
        this.amount = this.poolData.poolEntryFee;
        this.handlePayment();
      }
    });
  }

  EnterPool(poolId: string) {
    console.log('Entering Pool: ' + poolId);
    this.router.navigate(['game/' + poolId]);
  }

  createPool() {
    this.db.collection<pool>(`/pool`, ref => ref.where('CreatedBy', '==', this.userDocReference)).valueChanges().subscribe(pool => {
      if (pool.length !== 0) {
        console.log(`Can't create another pool.`);
      }
      else {
        console.log(`Create Pool Redirect`);
        this.router.navigate(['createpool']);
      }
    })
  }

  private formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  EntryFeeFormat(entryFee: number): string {
    return this.formatter.format(entryFee);
  }

  handlePayment() {
    let nav = `poolpayment/${this.poolId}/${this.amount}`;
    console.log(nav);
    this.router.navigate([nav]);
  }

  // @HostListener('window:popstate')
  // onpopstate() {
  //   this.handler.close()
  // }

}
