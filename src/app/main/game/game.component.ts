import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { pool } from '../pool/pool.component';
import { Observable } from 'rxjs';
import { map, merge } from 'rxjs/operators';
import { User, AuthService } from 'src/app/core/auth.service';

interface GoTAnswer {
  user: DocumentReference;
  pool: DocumentReference;
  first: string;
  last: string;
  alive: boolean;
  dead: boolean;
  whiteWalker?: boolean;
}

interface character {
  first: string;
  last: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private loading: boolean;

  private user: User;
  private userDocReference: DocumentReference;

  private poolId: string;
  private pool$: Observable<pool>;
  private poolReference: DocumentReference;

  private dbUserAnswers$: Observable<GoTAnswer[]>;

  private characters$: Observable<character[]>;

  private userSelections: GoTAnswer[];

  constructor(private auth: AuthService, private route: ActivatedRoute, private db: AngularFirestore, private router: Router) {
    this.loading = true;
  }

  ngOnInit() {
    this.userSelections = new Array();

    this.auth.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.userDocReference = this.db.doc(`/users/${this.user.uid}`).ref

        this.poolId = this.route.snapshot.paramMap.get('poolId');
  
        this.pool$ = this.db.doc<pool>(`/pool/${this.poolId}`).valueChanges();
        this.pool$.subscribe(pool => {
          if (pool === undefined) { // The Pool does not exist
            console.log('Cannot find pool.');
            this.router.navigate(['pool']);
          }

          let userInPool = false;
          pool.users.forEach(user => {
            if (user.isEqual(this.userDocReference)) {
              userInPool = true;
            }
          });
          if (!userInPool) { // The User is not in this pool
            console.log('You are not in this pool.');
            this.router.navigate(['pool']);
          }
          else { // Everything is alright
            this.poolReference = this.db.doc(`/pool/${this.poolId}`).ref;
            this.characters$ = this.db.collection<character>(`/characters`).valueChanges();
            this.characters$.subscribe(() => {
              this.loading = false;
              this.dbUserAnswers$ = this.db.collection<GoTAnswer>(`/selections`, ref =>
                ref.where('pool', '==', this.poolReference) &&
                ref.where('user', '==', this.userDocReference)
              ).valueChanges();
              this.dbUserAnswers$.subscribe(selections => {
                this.userSelections = selections;
              })
            })
          }
        });
      }
    });
  }

  AddSelection(first: string, last: string, ans: string) {
    let choseAliveAnswer = ans === 'alive' ? true : false;
    let data: GoTAnswer = {
      user: this.userDocReference,
      pool: this.poolReference,
      first: first,
      last: last,
      alive: choseAliveAnswer,
      dead: !choseAliveAnswer
    }

    if (this.userSelections && this.userSelections.length > 0) {
      let selectionFound = false;
      let selectionNumber = 0;
      for (let selection of this.userSelections) {
        if (selection.first === first && selection.last === last) {
          selectionFound = true;
          if (!choseAliveAnswer) {
            if (!selection.whiteWalker) selection.whiteWalker = false;
            data.whiteWalker = selection.whiteWalker;
          }
          else {
            data.whiteWalker = null;
          }
          this.userSelections[selectionNumber] = data;
        }
        selectionNumber++;
      }
      if (!selectionFound) {
        this.userSelections.push(data);
      }
    }
    else {
      this.userSelections.push(data);
    }

    // console.log(data.alive + ' :: ' + data.dead + ' :: ' + data.whiteWalker);
    this.db.doc(`/selections/${this.user.uid}_${first}_${last}`).set(data, { merge: true });
  }

  WhiteWalkerSelectionToggle(first: string, last: string) {
    let selectionNumber = 0;
    for (let selection of this.userSelections) {
      if (selection.first === first && selection.last === last) {
        if (!selection.whiteWalker) selection.whiteWalker = false;
        let data: GoTAnswer = {
          user: this.userDocReference,
          pool: this.poolReference,
          first: selection.first,
          last: selection.last,
          alive: selection.alive,
          dead: selection.dead,
          whiteWalker: !selection.whiteWalker
        }
        // console.log(!selection.whiteWalker);
        this.userSelections[selectionNumber] = data;
        this.db.doc(`/selections/${this.user.uid}_${first}_${last}`).set(data, { merge: true });
      }
      selectionNumber++;
    }
  }

  DeadSelected(first: string, last: string): boolean {
    if (this.userSelections) {
      for (let selection of this.userSelections) {
        if (selection.first === first && selection.last === last) {
          // console.log(first + " " + last + ': ' + selection.dead);
          return selection.dead;
        }
      };
    }
    return false;
  }

  alreadyChosenByUser(first: string, last: string, ans: string): boolean {
    for (let selection of this.userSelections) {
      if (selection.first === first && selection.last === last) {
        return ((ans === 'alive' && selection.alive) || (ans === 'dead' && selection.dead) || (ans === 'whitewalker' && selection.dead && selection.whiteWalker));
      }
    }
  }

}
