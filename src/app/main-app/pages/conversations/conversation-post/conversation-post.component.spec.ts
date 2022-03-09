import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPostComponent } from './conversation-post.component';

describe('ConversationPostComponent', () => {
  let component: ConversationPostComponent;
  let fixture: ComponentFixture<ConversationPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
