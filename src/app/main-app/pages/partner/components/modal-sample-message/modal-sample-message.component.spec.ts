import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSampleMessageComponent } from './modal-sample-message.component';

describe('ModalSampleMessageComponent', () => {
  let component: ModalSampleMessageComponent;
  let fixture: ComponentFixture<ModalSampleMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSampleMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSampleMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
