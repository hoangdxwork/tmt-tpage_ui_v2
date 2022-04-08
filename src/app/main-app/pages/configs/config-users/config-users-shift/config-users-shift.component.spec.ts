import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUsersShiftComponent } from './config-users-shift.component';

describe('ConfigUsersShiftComponent', () => {
  let component: ConfigUsersShiftComponent;
  let fixture: ComponentFixture<ConfigUsersShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigUsersShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUsersShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
