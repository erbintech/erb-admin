import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionTemplateComponent } from './commission-template.component';

describe('CommissionTemplateComponent', () => {
  let component: CommissionTemplateComponent;
  let fixture: ComponentFixture<CommissionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
