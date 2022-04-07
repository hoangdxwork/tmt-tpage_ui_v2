import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProductVariantComponent } from './config-product-variant.component';

describe('ConfigProductVariantComponent', () => {
  let component: ConfigProductVariantComponent;
  let fixture: ComponentFixture<ConfigProductVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProductVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
