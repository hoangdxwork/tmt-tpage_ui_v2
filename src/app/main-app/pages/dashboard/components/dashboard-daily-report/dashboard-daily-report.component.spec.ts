import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDailyReportComponent } from './dashboard-daily-report.component';

describe('DashboardDailyReportComponent', () => {
  let component: DashboardDailyReportComponent;
  let fixture: ComponentFixture<DashboardDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDailyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
