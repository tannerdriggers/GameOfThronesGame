import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MakePaymentComponent } from './payments/make-payment/make-payment.component';
import { MainComponent } from './main/main/main.component';

const routes: Routes = [
  { path: '', component: UserProfileComponent },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'payment', component: MakePaymentComponent },
  { path: 'main', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
