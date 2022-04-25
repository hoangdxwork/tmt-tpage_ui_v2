import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageUploadAvatarComponent } from './tpage-upload-avatar.component';

describe('TpageUploadAvatarComponent', () => {
  let component: TpageUploadAvatarComponent;
  let fixture: ComponentFixture<TpageUploadAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageUploadAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageUploadAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
