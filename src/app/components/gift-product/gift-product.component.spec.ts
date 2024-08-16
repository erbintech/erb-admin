import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftProductComponent } from './gift-product.component';

describe('GiftProductComponent', () => {
  let component: GiftProductComponent;
  let fixture: ComponentFixture<GiftProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
