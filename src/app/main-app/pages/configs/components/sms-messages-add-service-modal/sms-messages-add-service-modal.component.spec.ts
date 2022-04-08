import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SMSMessagesAddServiceModalComponent } from './sms-messages-add-service-modal.component';

describe('AddServiceModalComponent', () => {
  let component: SMSMessagesAddServiceModalComponent;
  let fixture: ComponentFixture<SMSMessagesAddServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SMSMessagesAddServiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SMSMessagesAddServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
