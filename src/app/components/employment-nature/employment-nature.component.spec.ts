import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentNatureComponent } from './employment-nature.component';

describe('EmploymentNatureComponent', () => {
  let component: EmploymentNatureComponent;
  let fixture: ComponentFixture<EmploymentNatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentNatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
