import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddShiftComponent } from './modal-add-shift.component';

describe('ModalAddShiftComponent', () => {
  let component: ModalAddShiftComponent;
  let fixture: ComponentFixture<ModalAddShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
