import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddManufacturerModalComponent } from './config-add-manufacturer-modal.component';

describe('ConfigAddManufacturerModalComponent', () => {
  let component: ConfigAddManufacturerModalComponent;
  let fixture: ComponentFixture<ConfigAddManufacturerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddManufacturerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddManufacturerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
