import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStaffReportComponent } from './dashboard-staff-report.component';

describe('DashboardStaffReportComponent', () => {
  let component: DashboardStaffReportComponent;
  let fixture: ComponentFixture<DashboardStaffReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardStaffReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStaffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
