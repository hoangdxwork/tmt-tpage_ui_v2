import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPaymentPackOfDataComponent } from './info-payment-pack-of-data.component';

describe('InfoPaymentPackOfDataComponent', () => {
  let component: InfoPaymentPackOfDataComponent;
  let fixture: ComponentFixture<InfoPaymentPackOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPaymentPackOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPaymentPackOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
