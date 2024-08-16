import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLoanDetailComponent } from './business-loan-detail.component';

describe('BusinessLoanDetailComponent', () => {
  let component: BusinessLoanDetailComponent;
  let fixture: ComponentFixture<BusinessLoanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessLoanDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLoanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
