import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolPaymentComponent } from './pool-payment.component';

describe('PoolPaymentComponent', () => {
  let component: PoolPaymentComponent;
  let fixture: ComponentFixture<PoolPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoolPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
