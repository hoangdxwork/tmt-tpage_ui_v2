import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportArticlesComponent } from './report-articles.component';

describe('ArticlesComponent', () => {
  let component: ReportArticlesComponent;
  let fixture: ComponentFixture<ReportArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
