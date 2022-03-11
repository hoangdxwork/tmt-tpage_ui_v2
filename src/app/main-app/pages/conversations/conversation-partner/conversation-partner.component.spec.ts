import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPartnerComponent } from './conversation-partner.component';

describe('ConversationPartnerComponent', () => {
  let component: ConversationPartnerComponent;
  let fixture: ComponentFixture<ConversationPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
