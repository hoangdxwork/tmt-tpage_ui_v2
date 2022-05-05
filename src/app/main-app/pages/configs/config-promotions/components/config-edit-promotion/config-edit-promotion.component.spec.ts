import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEditPromotionComponent } from './config-edit-promotion.component';

describe('ConfigEditPromotionComponent', () => {
  let component: ConfigEditPromotionComponent;
  let fixture: ComponentFixture<ConfigEditPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigEditPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEditPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
