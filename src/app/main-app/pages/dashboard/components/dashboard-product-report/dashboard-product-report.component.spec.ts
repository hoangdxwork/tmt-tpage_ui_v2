import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProductReportComponent } from './dashboard-product-report.component';

describe('DashboardProductReportComponent', () => {
  let component: DashboardProductReportComponent;
  let fixture: ComponentFixture<DashboardProductReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProductReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
