import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConnectingPageReportComponent } from './dashboard-connecting-page-report.component';

describe('DashboardConnectingPageReportComponent', () => {
  let component: DashboardConnectingPageReportComponent;
  let fixture: ComponentFixture<DashboardConnectingPageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardConnectingPageReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardConnectingPageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
