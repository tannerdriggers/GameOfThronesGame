import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './core/auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { PaymentModule } from './payments/payment/payment.module';
import { PoolComponent } from './main/pool/pool.component';
import { Module as StripeModule } from 'stripe-angular';
import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './main/game/game.component';
import { LoadingComponent } from './main/loading/loading.component';
import { CreatePoolComponent } from './main/create-pool/create-pool.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { PoolPaymentComponent } from './main/pool-payment/pool-payment.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { WebViewComponent } from './main/web-view/web-view.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    NavbarComponent,
    PoolComponent,
    GameComponent,
    LoadingComponent,
    CreatePoolComponent,
    PoolPaymentComponent,
    AdminPageComponent,
    WebViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    StripeModule.forRoot(),
    PaymentModule,
    ReactiveFormsModule,
    OrderModule,
    NgxPayPalModule,
    ClipboardModule,
    CoreModule
  ],
  providers: [AuthGuard, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
