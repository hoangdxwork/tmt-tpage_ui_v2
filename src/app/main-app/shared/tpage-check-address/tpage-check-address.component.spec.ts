import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageCheckAddressComponent } from './tpage-check-address.component';

describe('TpageCheckAddressComponent', () => {
  let component: TpageCheckAddressComponent;
  let fixture: ComponentFixture<TpageCheckAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageCheckAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageCheckAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
