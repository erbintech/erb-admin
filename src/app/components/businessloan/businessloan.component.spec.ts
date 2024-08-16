import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessloanComponent } from './businessloan.component';

describe('BusinessloanComponent', () => {
  let component: BusinessloanComponent;
  let fixture: ComponentFixture<BusinessloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
