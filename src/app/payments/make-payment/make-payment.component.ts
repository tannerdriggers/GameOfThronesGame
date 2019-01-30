import { Component, OnInit, HostListener } from '@angular/core';
import { PaymentService } from '../payment.service';
import { environment } from 'src/environments/environment';
import { AuthService, User } from 'src/app/core/auth.service';
declare const StripeCheckout: any;

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  user: User;

  handler: any;
  amount: number = 500; // == $5.00

  constructor(private paymentSvc: PaymentService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: token => {
        // this.paymentSvc.CreatePayment(token, this.amount);
      }
    });
  }

  handlePayment() {
    this.handler.open({
      name: 'Tanner Driggers',
      amount: this.amount
    });
  }

  @HostListener('window:popstate')
  onpopstate() {
    this.handler.close()
  }

}
