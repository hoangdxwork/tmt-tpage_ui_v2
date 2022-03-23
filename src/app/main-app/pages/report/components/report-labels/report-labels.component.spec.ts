import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLabelsComponent } from './report-labels.component';

describe('ReportLabelsComponent', () => {
  let component: ReportLabelsComponent;
  let fixture: ComponentFixture<ReportLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
