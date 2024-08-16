import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLetterSubscriptionComponent } from './news-letter-subscription.component';

describe('NewsLetterSubscriptionComponent', () => {
  let component: NewsLetterSubscriptionComponent;
  let fixture: ComponentFixture<NewsLetterSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsLetterSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsLetterSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
