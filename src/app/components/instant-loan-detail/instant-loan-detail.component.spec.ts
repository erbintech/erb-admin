import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantLoanDetailComponent } from './instant-loan-detail.component';

describe('InstantLoanDetailComponent', () => {
  let component: InstantLoanDetailComponent;
  let fixture: ComponentFixture<InstantLoanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantLoanDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantLoanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
