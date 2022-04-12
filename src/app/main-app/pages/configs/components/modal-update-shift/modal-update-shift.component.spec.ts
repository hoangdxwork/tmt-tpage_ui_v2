import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateShiftComponent } from './modal-update-shift.component';

describe('ModalUpdateShiftComponent', () => {
  let component: ModalUpdateShiftComponent;
  let fixture: ComponentFixture<ModalUpdateShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUpdateShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUpdateShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
