import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCreditCardPolicyComponent } from './bank-credit-card-policy.component';

describe('BankCreditCardPolicyComponent', () => {
  let component: BankCreditCardPolicyComponent;
  let fixture: ComponentFixture<BankCreditCardPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCreditCardPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCreditCardPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
