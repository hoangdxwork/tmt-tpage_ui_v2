import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPageReportComponent } from './connect-page-report.component';

describe('ConnectPageReportComponent', () => {
  let component: ConnectPageReportComponent;
  let fixture: ComponentFixture<ConnectPageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectPageReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
