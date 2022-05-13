import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageConversationAddressComponent } from './tpage-conversation-address.component';

describe('TpageConversationAddressComponent', () => {
  let component: TpageConversationAddressComponent;
  let fixture: ComponentFixture<TpageConversationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageConversationAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageConversationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
