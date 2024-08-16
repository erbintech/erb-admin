import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceTypeComponent } from './residence-type.component';

describe('ResidenceTypeComponent', () => {
  let component: ResidenceTypeComponent;
  let fixture: ComponentFixture<ResidenceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidenceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidenceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
