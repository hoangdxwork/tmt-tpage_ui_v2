import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelReportComponent } from './label-report.component';

describe('LabelReportComponent', () => {
  let component: LabelReportComponent;
  let fixture: ComponentFixture<LabelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
