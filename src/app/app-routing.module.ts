import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PoolComponent } from './main/pool/pool.component';
import { GameComponent } from './main/game/game.component';
import { CreatePoolComponent } from './main/create-pool/create-pool.component';
import { AuthGuard } from './core/auth.guard';
import { MakePaymentComponent } from './payments/make-payment/make-payment.component';
import { PoolPaymentComponent } from './main/pool-payment/pool-payment.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';

const routes: Routes = [
  { path: '', component: UserProfileComponent },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'pool', component: PoolComponent, canActivate: [AuthGuard] },
  { path: 'createpool', component: CreatePoolComponent, canActivate: [AuthGuard] },
  { path: 'poolpayment/:poolId/:amount', component: PoolPaymentComponent, canActivate: [AuthGuard] },
  { path: 'game/:poolId', component: GameComponent, canActivate: [AuthGuard] },
  { path: 'game', redirectTo: 'pool', pathMatch: 'full' },
  { path: 'makepayment', component: MakePaymentComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
