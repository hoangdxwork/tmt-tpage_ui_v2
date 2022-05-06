import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddAttributeProductModalComponent } from './config-add-attribute-product-modal.component';

describe('ConfigAddAttributeProductModalComponent', () => {
  let component: ConfigAddAttributeProductModalComponent;
  let fixture: ComponentFixture<ConfigAddAttributeProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddAttributeProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddAttributeProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
