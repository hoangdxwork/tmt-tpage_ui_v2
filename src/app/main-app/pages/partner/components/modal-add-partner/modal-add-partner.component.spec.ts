import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPartnerComponent } from './modal-add-partner.component';

describe('ModalAddPartnerComponent', () => {
  let component: ModalAddPartnerComponent;
  let fixture: ComponentFixture<ModalAddPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
