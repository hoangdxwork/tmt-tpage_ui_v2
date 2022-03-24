import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoOrderDebtOfPartnerComponent } from './info-order-debt-of-partner.component';

describe('InfoOrderDebtOfPartnerComponent', () => {
  let component: InfoOrderDebtOfPartnerComponent;
  let fixture: ComponentFixture<InfoOrderDebtOfPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoOrderDebtOfPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoOrderDebtOfPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
