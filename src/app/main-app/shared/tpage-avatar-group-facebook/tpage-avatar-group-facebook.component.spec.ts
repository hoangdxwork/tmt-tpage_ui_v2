import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageAvatarGroupFacebookComponent } from './tpage-avatar-group-facebook.component';

describe('TpageAvatarGroupFacebookComponent', () => {
  let component: TpageAvatarGroupFacebookComponent;
  let fixture: ComponentFixture<TpageAvatarGroupFacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageAvatarGroupFacebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageAvatarGroupFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
