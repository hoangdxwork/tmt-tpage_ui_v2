import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangePasswordUserComponent } from './modal-change-password-user.component';

describe('ModalChangePasswordUserComponent', () => {
  let component: ModalChangePasswordUserComponent;
  let fixture: ComponentFixture<ModalChangePasswordUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChangePasswordUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChangePasswordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
