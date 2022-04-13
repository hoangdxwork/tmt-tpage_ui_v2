import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListShiftComponent } from './modal-list-shift.component';

describe('ModalListShiftComponent', () => {
  let component: ModalListShiftComponent;
  let fixture: ComponentFixture<ModalListShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
