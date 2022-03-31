import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAutoChatComponent } from './config-auto-chat.component';

describe('ConfigAutoChatComponent', () => {
  let component: ConfigAutoChatComponent;
  let fixture: ComponentFixture<ConfigAutoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAutoChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAutoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
