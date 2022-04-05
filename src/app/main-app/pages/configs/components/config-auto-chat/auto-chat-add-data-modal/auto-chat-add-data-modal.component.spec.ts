import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoChatAddDataModalComponent } from './auto-chat-add-data-modal.component';

describe('AutoChatAddDataModalComponent', () => {
  let component: AutoChatAddDataModalComponent;
  let fixture: ComponentFixture<AutoChatAddDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoChatAddDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoChatAddDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
