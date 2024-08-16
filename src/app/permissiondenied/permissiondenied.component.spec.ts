import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissiondeniedComponent } from './permissiondenied.component';

describe('PermissiondeniedComponent', () => {
  let component: PermissiondeniedComponent;
  let fixture: ComponentFixture<PermissiondeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissiondeniedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissiondeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
