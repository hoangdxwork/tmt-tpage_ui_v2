import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerMessageComponent } from './drawer-message.component';

describe('DrawerMessageComponent', () => {
  let component: DrawerMessageComponent;
  let fixture: ComponentFixture<DrawerMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
