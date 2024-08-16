import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserScratchCardComponent } from './user-scratch-card.component';

describe('UserScratchCardComponent', () => {
  let component: UserScratchCardComponent;
  let fixture: ComponentFixture<UserScratchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserScratchCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserScratchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
