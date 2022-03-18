import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsConversationsComponent } from './tds-conversations.component';

describe('TdsConversationsComponent', () => {
  let component: TdsConversationsComponent;
  let fixture: ComponentFixture<TdsConversationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsConversationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
