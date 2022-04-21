import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigConversationTagsCreateDataModalComponent } from './config-conversation-tags-create-data-modal.component';

describe('ConfigConversationTagsCreateDataModalComponent', () => {
  let component: ConfigConversationTagsCreateDataModalComponent;
  let fixture: ComponentFixture<ConfigConversationTagsCreateDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigConversationTagsCreateDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigConversationTagsCreateDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
