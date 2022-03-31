import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPromotionsComponent } from './config-promotions.component';

describe('ConfigPromotionsComponent', () => {
  let component: ConfigPromotionsComponent;
  let fixture: ComponentFixture<ConfigPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPromotionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
