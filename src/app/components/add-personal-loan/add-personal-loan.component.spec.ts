import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonalLoanComponent } from './add-personal-loan.component';

describe('AddPersonalLoanComponent', () => {
  let component: AddPersonalLoanComponent;
  let fixture: ComponentFixture<AddPersonalLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPersonalLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonalLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
