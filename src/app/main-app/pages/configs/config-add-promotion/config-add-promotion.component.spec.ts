import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddPromotionComponent } from './config-add-promotion.component';

describe('ConfigAddPromotionComponent', () => {
  let component: ConfigAddPromotionComponent;
  let fixture: ComponentFixture<ConfigAddPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
