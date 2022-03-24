import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBirthdayPartnerComponent } from './modal-birthday-partner.component';

describe('ModalBirthdayPartnerComponent', () => {
  let component: ModalBirthdayPartnerComponent;
  let fixture: ComponentFixture<ModalBirthdayPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBirthdayPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBirthdayPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
