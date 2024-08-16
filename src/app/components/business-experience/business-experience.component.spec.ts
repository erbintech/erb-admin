import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessExperienceComponent } from './business-experience.component';

describe('BusinessExperienceComponent', () => {
  let component: BusinessExperienceComponent;
  let fixture: ComponentFixture<BusinessExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessExperienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
