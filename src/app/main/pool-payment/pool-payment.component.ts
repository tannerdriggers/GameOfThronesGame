import { Component, OnInit } from '@angular/core';
import { PayPalConfig, PayPalIntegrationType, PayPalEnvironment } from 'ngx-paypal';
import { of } from 'rxjs';
import { map } from 'rxjs/operators'
import { PaymentService } from 'src/app/payments/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { pool } from '../pool/pool.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pool-payment',
  templateUrl: './pool-payment.component.html',
  styleUrls: ['./pool-payment.component.scss']
})
export class PoolPaymentComponent implements OnInit {

  private loading: boolean;
  private error: boolean;

  private payPalConfig: PayPalConfig;
  private amount: number;
  private poolId: string;
  private pool: pool;

  constructor(private paymentSvc: PaymentService, private route: ActivatedRoute, private db: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.amount = Number(this.route.snapshot.paramMap.get('amount'));
    this.poolId = this.route.snapshot.paramMap.get('poolId');
    
    this.db.doc<pool>(`/pool/${this.poolId}`)
      .snapshotChanges()
      .pipe(
        map(a => {
            const data = a.payload.data() as pool;
            const id = a.payload.id;
            const numUsers: number = data.users.length;
            return { id, numUsers, ...data };
        })
    )
      .subscribe(pool => {
        this.pool = pool;
        this.loading = false;
    });

    this.initPayment();
  }

  private formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  EntryFeeFormat(entryFee: number): string {
    return this.formatter.format(entryFee);
  }

  private initPayment() {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Production, {
      commit: true,
      client: {
        production: environment.paypalKeys.live
      },
      button: {
        label: 'paypal',
        layout: 'vertical'
      },
      onAuthorize: (data, actions) => {
        console.log('Authorize');
        return of(undefined);
      },
      onPaymentComplete: (data, actions) => {
        this.paymentSvc.CreatePayment(data, this.amount, this.poolId);
        this.router.navigate([`/game/${this.poolId}`]);
      },
      onError: (err) => {
        this.error = true;
        console.error(err);
      },
      experience: {
        noShipping: true,
        brandName: 'Soft-Tan'
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: this.amount
        }
      }],
      note_to_payer: 'Contact us if you have troubles processing payment'
    });
  }

}
