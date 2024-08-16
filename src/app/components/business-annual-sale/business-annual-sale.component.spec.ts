import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessannualsaleComponent } from './business-annual-sale.component';

describe('BusinessannualsaleComponent', () => {
  let component: BusinessannualsaleComponent;
  let fixture: ComponentFixture<BusinessannualsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessannualsaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessannualsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
