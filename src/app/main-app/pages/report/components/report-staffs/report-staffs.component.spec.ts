import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStaffsComponent } from './report-staffs.component';

describe('ReportStaffsComponent', () => {
  let component: ReportStaffsComponent;
  let fixture: ComponentFixture<ReportStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportStaffsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
