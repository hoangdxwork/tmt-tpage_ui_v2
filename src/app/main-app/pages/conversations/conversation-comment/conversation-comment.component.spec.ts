import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationCommentComponent } from './conversation-comment.component';

describe('ConversationCommentComponent', () => {
  let component: ConversationCommentComponent;
  let fixture: ComponentFixture<ConversationCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
