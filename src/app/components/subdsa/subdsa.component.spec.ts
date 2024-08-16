import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdsaComponent } from './subdsa.component';

describe('SubdsaComponent', () => {
  let component: SubdsaComponent;
  let fixture: ComponentFixture<SubdsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubdsaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
