import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPromotionAllComponent } from './config-promotion-all.component';

describe('ConfigPromotionAllComponent', () => {
  let component: ConfigPromotionAllComponent;
  let fixture: ComponentFixture<ConfigPromotionAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPromotionAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPromotionAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
