import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCreditCardComponent } from './bank-credit-card.component';

describe('BankCreditCardComponent', () => {
  let component: BankCreditCardComponent;
  let fixture: ComponentFixture<BankCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCreditCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
