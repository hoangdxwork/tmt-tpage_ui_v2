import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRevenueReportComponent } from './dashboard-revenue-report.component';

describe('DashboardRevenueReportComponent', () => {
  let component: DashboardRevenueReportComponent;
  let fixture: ComponentFixture<DashboardRevenueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRevenueReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRevenueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
