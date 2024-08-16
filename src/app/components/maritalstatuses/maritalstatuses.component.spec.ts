import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaritalstatusesComponent } from './maritalstatuses.component';

describe('MaritalstatusesComponent', () => {
  let component: MaritalstatusesComponent;
  let fixture: ComponentFixture<MaritalstatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaritalstatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaritalstatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
