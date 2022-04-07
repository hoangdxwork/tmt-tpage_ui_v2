import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTemplateProductVariantComponent } from './table-template-product-variant.component';

describe('TableTemplateProductVariantComponent', () => {
  let component: TableTemplateProductVariantComponent;
  let fixture: ComponentFixture<TableTemplateProductVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTemplateProductVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTemplateProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
