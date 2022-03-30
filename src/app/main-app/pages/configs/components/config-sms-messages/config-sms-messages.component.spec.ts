import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSmsMessagesComponent } from './config-sms-messages.component';

describe('ConfigSmsMessagesComponent', () => {
  let component: ConfigSmsMessagesComponent;
  let fixture: ComponentFixture<ConfigSmsMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigSmsMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSmsMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
