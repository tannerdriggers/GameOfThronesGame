import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { User, AuthService } from 'src/app/core/auth.service';
import { Observable, of } from 'rxjs';
import { pool } from 'src/app/main/pool/pool.component';
import { GoTAnswer, Answer, CorrectAnswerChoice, character } from 'src/app/main/game/game.component';
import { map } from 'rxjs/operators';

interface NumberCorrect {
  numberCorrect: number;
  numberWrong: number;
  poolId: string;
  userId: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  user: User;
  users$: Observable<User[]>;
  users: User[];
  currentUser: User;

  pools$: Observable<pool[]>;
  pools: pool[];

  numberCorrect: NumberCorrect[];

  constructor(private db: AngularFirestore, private auth: AuthService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      if (user) {
        if (this.user.uid != 'vqmeUeMsNGZgNcDcqzSSwfMghy62') {
          console.log('Admins Only.');
          this.auth.homeRedirect();
        }
        else {
          this.pools$ = this.db.collection<pool>('/pool').snapshotChanges().pipe(
            map(actions => {
              return actions.map(a => {
                const data = a.payload.doc.data() as pool;
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })
          );
          this.db.collection<User>(`/users`).valueChanges().subscribe(users => {
            this.users = users;
            this.pools$.subscribe(pools => {
              this.db.collection<GoTAnswer>('/selections').valueChanges().subscribe(selections => {
                this.db.collection<Answer>('/answers').valueChanges().subscribe(answers => {
                  this.db.collection<character>(`/characters`).snapshotChanges().pipe(
                    map(actions => {
                      return actions.map(a => {
                        const data = a.payload.doc.data() as character;
                        const id = a.payload.doc.id;
                        return { id, ...data };
                      });
                    })
                  )
                    .subscribe(characters => {
                      this.db.collection<CorrectAnswerChoice>(`/answerChoices`).snapshotChanges().pipe(
                        map(actions => {
                          return actions.map(a => {
                            const data = a.payload.doc.data() as CorrectAnswerChoice;
                            const id = a.payload.doc.id;
                            return { id, ...data };
                          });
                        })
                      )
                        .subscribe(answerChoices => {
                          for (let pool of pools) {
                            for (let u of pool.users) {
                              for (let us of users) {
                                if (u.id === us.uid) {
                                  let numberCorrect = 0;
                                  let numberWrong = 0;
                                  for (let select of selections) {
                                    for (let ans of answers) {
                                      let answer: CorrectAnswerChoice;
                                      for (let ansChoice of answerChoices) {
                                        if (ans.answer.id === ansChoice.id) {
                                          answer = ansChoice;
                                        } // answer is found and put inside the answer variable
                                      } // each answer choice to be mapped to the correct answer
                                
                                      let character: character;
                                      for (let char of characters) {
                                        if (ans.character.id === char.id) {
                                          character = char;
                                        } // character is found and put inside the character variable
                                      } // each character to be mapped to the correct answer
                                
                                      // the selection, user, pool, and character equal each other to compare answers
                                      if (select.user.id === us.uid && select.pool.id === pool.id && select.first === character.first && select.last === character.last) {
                                        if (answer && character) { // neither answer or character are null
                                          // console.log('answer:', answer, 'selection:', select)
                                          // correct answer is alive
                                          if (answer.alive) {

                                            // user selected alive
                                            if (select.alive) {
                                              numberCorrect++;
                                            }
                                            // user selected dead
                                            else {
                                              numberWrong++;
                                            }

                                            if (select.whiteWalker) {
                                              numberWrong++;
                                            }
                                          }
                                          else { // correct answer is dead

                                            // user selected dead
                                            if (select.dead) {
                                              numberCorrect++;
                                            }
                                            // user selected alive
                                            else {
                                              numberWrong++;
                                            }

                                            // Chose whitewalker correctly
                                            if (select.whiteWalker === answer.whitewalker) {
                                              numberCorrect++;
                                            }
                                            else {
                                              numberWrong++;
                                            }
                                          }
                                        } // end of calculating number correct and wrong for that choice

                                        this.addNumCorrect({
                                          poolId: pool.id,
                                          userId: us.uid,
                                          numberCorrect: numberCorrect,
                                          numberWrong: numberWrong
                                        });

                                        break; // selection found
                                      } // selection found
                                    } // each correct answer
                                  } // each selection
                                  
                                  break; // user found
                                } // user found
                              } // each user
                            } // pool.users
                          } // pools

                        });
                    });
                });
              });
            });
          });
        }
      }
    });
  }

  getNumberCorrect(poolId: string, userId: string): number {
    if (this.numberCorrect) {
      for (let numCorrect of this.numberCorrect) {
        if (numCorrect.poolId === poolId && numCorrect.userId === userId) {
          return numCorrect.numberCorrect;
        }
      }
    }
    return 0;
  }

  getNumberWrong(poolId: string, userId: string): number {
    if (this.numberCorrect) {
      for (let numCorrect of this.numberCorrect) {
        if (numCorrect.poolId === poolId && numCorrect.userId === userId) {
          return numCorrect.numberWrong;
        }
      }
    }
    return 0;
  }

  getUser(user: DocumentReference): User {
    for (let u of this.users) {
      if (u.uid === user.id) {
        this.currentUser = u;
        return u;
      }
    }
    return null;
  }

  addNumCorrect(numCorrect: NumberCorrect) {
    // console.log('number Correct:', numCorrect);
    if (!this.numberCorrect) {
      this.numberCorrect = new Array();
    }

    let count = 0;
    let inArray = false;
    for (let numberCorrect of this.numberCorrect) {
      if (numberCorrect.poolId === numCorrect.poolId && numberCorrect.userId === numCorrect.userId) {
        this.numberCorrect[count] = numCorrect;
        inArray = true;
      }
      count++;
    }

    if (!inArray) {
      this.numberCorrect.push(numCorrect);
    }
  }

}
