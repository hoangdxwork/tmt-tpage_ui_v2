import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddUOMModalComponent } from './config-add-UOM-modal.component';

describe('ConfigAddUOMModalComponent', () => {
  let component: ConfigAddUOMModalComponent;
  let fixture: ComponentFixture<ConfigAddUOMModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddUOMModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddUOMModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
