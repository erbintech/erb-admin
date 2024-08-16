import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetCommissionComponent } from './admin-get-commission.component';

describe('AdminGetCommissionComponent', () => {
  let component: AdminGetCommissionComponent;
  let fixture: ComponentFixture<AdminGetCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGetCommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGetCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
