import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessLoanComponent } from './add-business-loan.component';

describe('AddBusinessLoanComponent', () => {
  let component: AddBusinessLoanComponent;
  let fixture: ComponentFixture<AddBusinessLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusinessLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
