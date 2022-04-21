import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProductDetailsComponent } from './config-product-details.component';

describe('ConfigProductDetailsComponent', () => {
  let component: ConfigProductDetailsComponent;
  let fixture: ComponentFixture<ConfigProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
