import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankLoanPolicyComponent } from './add-bank-loan-policy.component';

describe('AddBankLoanPolicyComponent', () => {
  let component: AddBankLoanPolicyComponent;
  let fixture: ComponentFixture<AddBankLoanPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankLoanPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankLoanPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
