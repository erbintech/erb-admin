import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorAddComponent } from './connector-add.component';

describe('ConnectorAddComponent', () => {
  let component: ConnectorAddComponent;
  let fixture: ComponentFixture<ConnectorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
