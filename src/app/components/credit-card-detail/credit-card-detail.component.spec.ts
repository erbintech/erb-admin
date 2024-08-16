import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardDetailComponent } from './credit-card-detail.component';

describe('CreditCardDetailComponent', () => {
  let component: CreditCardDetailComponent;
  let fixture: ComponentFixture<CreditCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
