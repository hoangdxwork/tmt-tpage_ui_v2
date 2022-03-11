import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAllComponent } from './conversation-all.component';

describe('ConversationAllComponent', () => {
  let component: ConversationAllComponent;
  let fixture: ComponentFixture<ConversationAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
