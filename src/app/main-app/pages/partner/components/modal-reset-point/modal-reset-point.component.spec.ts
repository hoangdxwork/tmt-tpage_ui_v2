import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResetPointComponent } from './modal-reset-point.component';

describe('ModalResetPointComponent', () => {
  let component: ModalResetPointComponent;
  let fixture: ComponentFixture<ModalResetPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResetPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalResetPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
