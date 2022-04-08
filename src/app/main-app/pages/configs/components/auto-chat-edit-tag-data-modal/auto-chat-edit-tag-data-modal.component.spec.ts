import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoChatEditTagDataModalComponent } from './auto-chat-edit-tag-data-modal.component';

describe('AutoChatEditTagDataModalComponent', () => {
  let component: AutoChatEditTagDataModalComponent;
  let fixture: ComponentFixture<AutoChatEditTagDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoChatEditTagDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoChatEditTagDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
