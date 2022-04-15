import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddProductComponent } from './config-add-product.component';

describe('ConfigAddProductComponent', () => {
  let component: ConfigAddProductComponent;
  let fixture: ComponentFixture<ConfigAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
