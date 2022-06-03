import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmptyDataComponent } from './dashboard-empty-data.component';

describe('DashboardEmptyDataComponent', () => {
  let component: DashboardEmptyDataComponent;
  let fixture: ComponentFixture<DashboardEmptyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardEmptyDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEmptyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
