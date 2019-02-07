import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pool } from '../pool/pool.component';

@Component({
  selector: 'app-create-pool',
  templateUrl: './create-pool.component.html',
  styleUrls: ['./create-pool.component.scss']
})
export class CreatePoolComponent implements OnInit {

  private loading: boolean;

  private user: User;

  private poolForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    entryFee: new FormControl('', Validators.required)
  });

  constructor(private auth: AuthService, private db: AngularFirestore, private router: Router) {
    this.loading = false;
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
    })
  }

  Submit() {
    console.log(this.poolForm.value);
    this.loading = true;
    if (this.poolForm.valid && this.ValidEntryFee()) {
      let data: pool = {
        CreatedBy: this.db.doc(`/users/${this.user.uid}`).ref,
        CreatedOn: new Date(),
        finished: false,
        poolEntryFee: Number(Number(this.poolForm.value.entryFee).toFixed(2)),
        poolName: this.poolForm.value.name,
        users: [],
        winnersPaid: false
      }
      this.db.collection(`/pool`).add(data)
        .then(() => {
          this.loading = false;
          this.router.navigate(['pool']);
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        })
    }
  }

  ValidEntryFee(): boolean {
    return (!!this.poolForm.value.entryFee && !isNaN(this.poolForm.value.entryFee))
  }

}
