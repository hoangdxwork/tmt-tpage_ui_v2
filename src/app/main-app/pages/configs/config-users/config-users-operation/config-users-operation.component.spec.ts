import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUsersOperationComponent } from './config-users-operation.component';

describe('ConfigUsersOperationComponent', () => {
  let component: ConfigUsersOperationComponent;
  let fixture: ComponentFixture<ConfigUsersOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigUsersOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUsersOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
