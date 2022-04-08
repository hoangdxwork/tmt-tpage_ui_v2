import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigConversationTagsComponent } from './config-conversation-tags.component';

describe('ConfigConversationTagsComponent', () => {
  let component: ConfigConversationTagsComponent;
  let fixture: ComponentFixture<ConfigConversationTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigConversationTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigConversationTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
