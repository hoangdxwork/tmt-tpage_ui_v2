import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPromotionGroupComponent } from './config-promotion-group.component';

describe('ConfigPromotionGroupComponent', () => {
  let component: ConfigPromotionGroupComponent;
  let fixture: ComponentFixture<ConfigPromotionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPromotionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPromotionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
