import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangingRateReportComponent } from './changing-rate-report.component';

describe('ChangingRateReportComponent', () => {
  let component: ChangingRateReportComponent;
  let fixture: ComponentFixture<ChangingRateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangingRateReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangingRateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
