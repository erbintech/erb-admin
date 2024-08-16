import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantLoanComponent } from './instant-loan.component';

describe('InstantLoanComponent', () => {
  let component: InstantLoanComponent;
  let fixture: ComponentFixture<InstantLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
