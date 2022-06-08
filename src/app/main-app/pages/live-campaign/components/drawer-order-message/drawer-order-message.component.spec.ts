import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerOrderMessageComponent } from './drawer-order-message.component';

describe('DrawerOrderMessageComponent', () => {
  let component: DrawerOrderMessageComponent;
  let fixture: ComponentFixture<DrawerOrderMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerOrderMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerOrderMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
