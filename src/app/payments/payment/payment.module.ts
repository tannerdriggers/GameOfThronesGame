import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPayPalModule } from 'ngx-paypal';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { PaymentService } from '../payment.service';

@NgModule({
  declarations: [MakePaymentComponent],
  imports: [
    NgxPayPalModule,
    CommonModule
  ],
  providers: [PaymentService]
})
export class PaymentModule { }
