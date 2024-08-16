import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentServiceTypeComponent } from './employment-service-type.component';

describe('EmploymentServiceTypeComponent', () => {
  let component: EmploymentServiceTypeComponent;
  let fixture: ComponentFixture<EmploymentServiceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentServiceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
