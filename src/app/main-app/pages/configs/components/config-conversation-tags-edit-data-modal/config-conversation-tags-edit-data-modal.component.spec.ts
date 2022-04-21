import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigConversationTagsEditDataModalComponent } from './config-conversation-tags-edit-data-modal.component';

describe('AutoChatEditTagDataModalComponent', () => {
  let component: ConfigConversationTagsEditDataModalComponent;
  let fixture: ComponentFixture<ConfigConversationTagsEditDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigConversationTagsEditDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigConversationTagsEditDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
