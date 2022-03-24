import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageAvatarFacebookComponent } from './tpage-avatar-facebook.component';

describe('TpageAvatarFacebookComponent', () => {
  let component: TpageAvatarFacebookComponent;
  let fixture: ComponentFixture<TpageAvatarFacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageAvatarFacebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageAvatarFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
