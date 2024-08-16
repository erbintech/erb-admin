import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankLoanPolicyComponent } from './bank-loan-policy.component';

describe('BankLoanPolicyComponent', () => {
  let component: BankLoanPolicyComponent;
  let fixture: ComponentFixture<BankLoanPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankLoanPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankLoanPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
