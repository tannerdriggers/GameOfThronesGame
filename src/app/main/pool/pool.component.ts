import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

export interface pool {
  id: string;
  poolName: string;
  users: string[];
  poolEntryFee: number;
}

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {

  private pools$: Observable<any>

  constructor(private auth: AuthService, private db: AngularFirestore) { }

  ngOnInit() {
    this.pools$ = this.db.collection<pool>(`/pool`).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as pool;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    this.pools$.subscribe(a => console.log(a));
  }

  joinPool(poolId: string) {
    console.log(poolId)
  }

}
