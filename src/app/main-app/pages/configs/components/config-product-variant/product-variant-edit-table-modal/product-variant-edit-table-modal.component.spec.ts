import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantEditTableModalComponent } from './product-variant-edit-table-modal.component';

describe('ProductVariantEditTableModalComponent', () => {
  let component: ProductVariantEditTableModalComponent;
  let fixture: ComponentFixture<ProductVariantEditTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVariantEditTableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantEditTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
