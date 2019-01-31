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
import { MainComponent } from './main/main/main.component';
import { Module as StripeModule } from 'stripe-angular';
import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './main/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    NavbarComponent,
    PoolComponent,
    MainComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    StripeModule.forRoot(),
    PaymentModule,
    CoreModule
  ],
  providers: [AuthGuard, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
