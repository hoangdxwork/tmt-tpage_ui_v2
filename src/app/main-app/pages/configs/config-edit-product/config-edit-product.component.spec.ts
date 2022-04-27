import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEditProductComponent } from './config-edit-product.component';

describe('ConfigEditProductComponent', () => {
  let component: ConfigEditProductComponent;
  let fixture: ComponentFixture<ConfigEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigEditProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
