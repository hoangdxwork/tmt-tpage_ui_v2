import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditPartnerComponent } from './modal-edit-partner.component';

describe('ModalEditPartnerComponent', () => {
  let component: ModalEditPartnerComponent;
  let fixture: ComponentFixture<ModalEditPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
