import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorDetailComponent } from './connector-detail.component';

describe('ConnectorDetailComponent', () => {
  let component: ConnectorDetailComponent;
  let fixture: ComponentFixture<ConnectorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
