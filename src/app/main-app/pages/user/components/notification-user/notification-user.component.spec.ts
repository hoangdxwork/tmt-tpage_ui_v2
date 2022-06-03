import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUserComponent } from './notification-user.component';

describe('NotificationUserComponent', () => {
  let component: NotificationUserComponent;
  let fixture: ComponentFixture<NotificationUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
