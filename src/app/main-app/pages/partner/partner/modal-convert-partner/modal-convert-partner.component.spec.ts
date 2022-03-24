import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConvertPartnerComponent } from './modal-convert-partner.component';

describe('ModalConvertPartnerComponent', () => {
  let component: ModalConvertPartnerComponent;
  let fixture: ComponentFixture<ModalConvertPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConvertPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConvertPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
