import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddVariantProductModalComponent } from './config-add-variant-product-modal.component';

describe('ConfigAddVariantProductModalComponent', () => {
  let component: ConfigAddVariantProductModalComponent;
  let fixture: ComponentFixture<ConfigAddVariantProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddVariantProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddVariantProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
