import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPromotionComboComponent } from './config-promotion-combo.component';

describe('ConfigPromotionComboComponent', () => {
  let component: ConfigPromotionComboComponent;
  let fixture: ComponentFixture<ConfigPromotionComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPromotionComboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPromotionComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
