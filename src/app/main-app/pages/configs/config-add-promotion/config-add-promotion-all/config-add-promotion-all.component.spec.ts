import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddPromotionAllComponent } from './config-add-promotion-all.component';

describe('ConfigAddPromotionAllComponent', () => {
  let component: ConfigAddPromotionAllComponent;
  let fixture: ComponentFixture<ConfigAddPromotionAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddPromotionAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddPromotionAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
