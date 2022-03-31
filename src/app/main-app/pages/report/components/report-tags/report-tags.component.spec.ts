import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTagsComponent } from './report-tags.component';

describe('ReportTagsComponent', () => {
  let component: ReportTagsComponent;
  let fixture: ComponentFixture<ReportTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
