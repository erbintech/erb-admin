import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeloanComponent } from './homeloan.component';

describe('HomeloanComponent', () => {
  let component: HomeloanComponent;
  let fixture: ComponentFixture<HomeloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
