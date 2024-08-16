import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEmploymentTypeComponent } from './service-employment-type.component';

describe('ServiceEmploymentTypeComponent', () => {
  let component: ServiceEmploymentTypeComponent;
  let fixture: ComponentFixture<ServiceEmploymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceEmploymentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEmploymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
