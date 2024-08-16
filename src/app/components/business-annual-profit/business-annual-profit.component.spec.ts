import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAnnualProfitComponent } from './business-annual-profit.component';

describe('BusinessAnnualProfitComponent', () => {
  let component: BusinessAnnualProfitComponent;
  let fixture: ComponentFixture<BusinessAnnualProfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessAnnualProfitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAnnualProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
