import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddProductVariantComponent } from './config-add-product-variant.component';

describe('ConfigAddProductVariantComponent', () => {
  let component: ConfigAddProductVariantComponent;
  let fixture: ComponentFixture<ConfigAddProductVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddProductVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
