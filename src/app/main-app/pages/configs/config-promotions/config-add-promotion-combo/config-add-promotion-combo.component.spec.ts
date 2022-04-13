import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddPromotionComboComponent } from './config-add-promotion-combo.component';

describe('ConfigAddPromotionComboComponent', () => {
  let component: ConfigAddPromotionComboComponent;
  let fixture: ComponentFixture<ConfigAddPromotionComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddPromotionComboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddPromotionComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
