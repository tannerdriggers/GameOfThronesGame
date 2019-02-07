import { Component, OnInit, HostListener } from '@angular/core';
import { PaymentService } from '../payment.service';
import { environment } from 'src/environments/environment';
import { AuthService, User } from 'src/app/core/auth.service';
import { of } from 'rxjs';
import { PayPalConfig, PayPalIntegrationType, PayPalEnvironment } from 'ngx-paypal';
declare const StripeCheckout: any;

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  user: User;

  handler: any;
  amount: number = 5.00;

  public payPalConfig?: PayPalConfig;

  constructor(private paymentSvc: PaymentService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.initConfig();
  }

  private initConfig() {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        sandbox: 'AT32PQy3r3aSrUqOtG8bHMnysyz8NSSWCdG_Bfe9KCUYaueJ1Fp6TqTYG76XcBIkVcHlnK3eKT4rIMrF'
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
        this.paymentSvc.CreatePayment(data, this.amount, this.amount.toString())
        console.log('OnPaymentComplete');
        console.log(data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
        console.log(data);
      },
      onError: (err) => {
        console.log('OnError');
      },
      onClick: () => {
        console.log('onClick');
      },
      validate: (actions) => {
        console.log(actions);
      },
      experience: {
        noShipping: true,
        brandName: 'Soft-Tan'
      },
    });
  }

  AddTransaction() {
    this.payPalConfig.transactions = new Array();
    
    let amount = Number(12.66666666.toFixed(2));
    console.log(amount);
    this.payPalConfig.transactions.push({
      amount: {
        currency: 'USD',
        total: amount
      }
    })
  }

}
