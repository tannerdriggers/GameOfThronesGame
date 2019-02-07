import { TestBed, async, inject } from '@angular/core/testing';

import { GameAccessGuard } from './game-access.guard';

describe('GameAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameAccessGuard]
    });
  });

  it('should ...', inject([GameAccessGuard], (guard: GameAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
