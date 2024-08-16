import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHomeLoanComponent } from './add-home-loan.component';

describe('AddHomeLoanComponent', () => {
  let component: AddHomeLoanComponent;
  let fixture: ComponentFixture<AddHomeLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHomeLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHomeLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
