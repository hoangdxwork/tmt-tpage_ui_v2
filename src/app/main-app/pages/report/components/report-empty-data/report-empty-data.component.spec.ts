import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEmptyDataComponent } from './report-empty-data.component';

describe('ReportEmptyDataComponent', () => {
  let component: ReportEmptyDataComponent;
  let fixture: ComponentFixture<ReportEmptyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportEmptyDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEmptyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
