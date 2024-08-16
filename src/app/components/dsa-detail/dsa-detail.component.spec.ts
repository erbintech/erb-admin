import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsaDetailComponent } from './dsa-detail.component';

describe('DsaDetailComponent', () => {
  let component: DsaDetailComponent;
  let fixture: ComponentFixture<DsaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsaDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
