import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanDetailComponent } from './home-loan-detail.component';

describe('HomeLoanDetailComponent', () => {
  let component: HomeLoanDetailComponent;
  let fixture: ComponentFixture<HomeLoanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLoanDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
