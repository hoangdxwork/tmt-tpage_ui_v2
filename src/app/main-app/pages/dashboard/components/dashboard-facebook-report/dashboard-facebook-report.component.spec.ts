import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFacebookReportComponent } from './dashboard-facebook-report.component';

describe('DashboardFacebookReportComponent', () => {
  let component: DashboardFacebookReportComponent;
  let fixture: ComponentFixture<DashboardFacebookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFacebookReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFacebookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
