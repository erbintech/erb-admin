import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanDetailComponent } from './personal-loan-detail.component';

describe('PersonalLoanDetailComponent', () => {
  let component: PersonalLoanDetailComponent;
  let fixture: ComponentFixture<PersonalLoanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalLoanDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
