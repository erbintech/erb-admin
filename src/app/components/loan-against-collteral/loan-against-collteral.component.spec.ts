import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAgainstCollteralComponent } from './loan-against-collteral.component';

describe('LoanAgainstCollteralComponent', () => {
  let component: LoanAgainstCollteralComponent;
  let fixture: ComponentFixture<LoanAgainstCollteralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAgainstCollteralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAgainstCollteralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
