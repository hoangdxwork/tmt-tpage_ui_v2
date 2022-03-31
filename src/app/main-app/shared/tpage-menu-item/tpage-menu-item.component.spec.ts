import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageMenuItemComponent } from './tpage-menu-item.component';

describe('TpageMenuItemComponent', () => {
  let component: TpageMenuItemComponent;
  let fixture: ComponentFixture<TpageMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageMenuItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
