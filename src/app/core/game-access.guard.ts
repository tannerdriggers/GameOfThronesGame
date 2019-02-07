import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap, first } from 'rxjs/operators'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService, User } from './auth.service';
import { pool } from '../main/pool/pool.component';

@Injectable({
  providedIn: 'root'
})
export class GameAccessGuard implements CanActivate {

  user: User;
  userDocReference: DocumentReference;

  constructor(private db: AngularFirestore, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    let poolId = this.route.snapshot.paramMap.get('poolId');

    return this.db.collection<pool>(`/pool`).valueChanges().pipe(
      map(pools => pools.length === 0),
      tap(goodPool => {
        if (!goodPool) {
          console.log('Cannot access the game.');
          this.router.navigate(['/pool']);
        }
      })
    )
  }
}
