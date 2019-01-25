import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { PaymentService } from '../payment.service';

@NgModule({
  declarations: [MakePaymentComponent],
  imports: [
    CommonModule
  ],
  providers: [PaymentService]
})
export class PaymentModule { }
