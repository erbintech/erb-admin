import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdsaDetailComponent } from './subdsa-detail.component';

describe('SubdsaDetailComponent', () => {
  let component: SubdsaDetailComponent;
  let fixture: ComponentFixture<SubdsaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubdsaDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdsaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
