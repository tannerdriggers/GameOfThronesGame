import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/core/auth.service';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { pool } from '../pool/pool.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  user: User;
  userDocReference: DocumentReference;
  userPools$: Observable<pool[]>;

  constructor(private auth: AuthService, private db: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      this.userDocReference = this.db.doc(`/users/${this.user.uid}`).ref;
      this.userPools$ = this.db.collection<pool>(`/pool`, ref => ref.where('users', 'array-contains', this.userDocReference)).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as pool;
            const id = a.payload.doc.id;
            const numUsers = data.users.length;
            return { id, numUsers, ...data };
          });
        })
      )

      this.userPools$.subscribe(up => {
        console.log(up);
        
      });
    });
  }

  joinPool(poolId: string) {
    console.log('Entering Pool')
  }

  createPool() {
    this.router.navigate(['createPool']);
  }

}
