import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddOriginCountryModalComponent } from './config-add-origin-country-modal.component';

describe('ConfigAddOriginCountryModalComponent', () => {
  let component: ConfigAddOriginCountryModalComponent;
  let fixture: ComponentFixture<ConfigAddOriginCountryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddOriginCountryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddOriginCountryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
