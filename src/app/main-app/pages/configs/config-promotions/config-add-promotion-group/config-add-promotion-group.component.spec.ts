import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddPromotionGroupComponent } from './config-add-promotion-group.component';

describe('ConfigAddPromotionGroupComponent', () => {
  let component: ConfigAddPromotionGroupComponent;
  let fixture: ComponentFixture<ConfigAddPromotionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddPromotionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddPromotionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
