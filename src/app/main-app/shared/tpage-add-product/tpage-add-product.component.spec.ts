import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageAddProductComponent } from './tpage-add-product.component';

describe('TpageAddProductComponent', () => {
  let component: TpageAddProductComponent;
  let fixture: ComponentFixture<TpageAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageAddProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
