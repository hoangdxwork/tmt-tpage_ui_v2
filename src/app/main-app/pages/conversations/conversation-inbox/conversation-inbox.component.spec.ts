import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationInboxComponent } from './conversation-inbox.component';

describe('ConversationInboxComponent', () => {
  let component: ConversationInboxComponent;
  let fixture: ComponentFixture<ConversationInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationInboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
