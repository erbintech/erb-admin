import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceWiseDocumentsComponent } from './service-wise-documents.component';

describe('ServiceWiseDocumentsComponent', () => {
  let component: ServiceWiseDocumentsComponent;
  let fixture: ComponentFixture<ServiceWiseDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceWiseDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceWiseDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
