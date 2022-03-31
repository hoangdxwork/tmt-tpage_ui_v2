import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFacebookComponent } from './report-facebook.component';

describe('ReportFacebookComponent', () => {
  let component: ReportFacebookComponent;
  let fixture: ComponentFixture<ReportFacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFacebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
