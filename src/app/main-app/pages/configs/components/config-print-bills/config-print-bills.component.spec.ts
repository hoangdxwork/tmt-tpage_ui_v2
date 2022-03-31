import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPrintBillsComponent } from './config-print-bills.component';

describe('ConfigPrintBillsComponent', () => {
  let component: ConfigPrintBillsComponent;
  let fixture: ComponentFixture<ConfigPrintBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPrintBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPrintBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
