import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagReportComponent } from './dashboard-tag-report.component';

describe('DashboardLabelReportComponent', () => {
  let component: DashboardTagReportComponent;
  let fixture: ComponentFixture<DashboardTagReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTagReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTagReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
