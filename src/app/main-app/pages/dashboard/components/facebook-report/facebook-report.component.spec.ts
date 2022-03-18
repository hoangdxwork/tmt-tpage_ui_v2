import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookReportComponent } from './facebook-report.component';

describe('FacebookReportComponent', () => {
  let component: FacebookReportComponent;
  let fixture: ComponentFixture<FacebookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
