import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoApplicantRelationComponent } from './co-applicant-relation.component';

describe('CoApplicantRelationComponent', () => {
  let component: CoApplicantRelationComponent;
  let fixture: ComponentFixture<CoApplicantRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoApplicantRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoApplicantRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
