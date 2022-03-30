import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProductFormsComponent } from './config-product-forms.component';

describe('ConfigProductFormsComponent', () => {
  let component: ConfigProductFormsComponent;
  let fixture: ComponentFixture<ConfigProductFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProductFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProductFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
