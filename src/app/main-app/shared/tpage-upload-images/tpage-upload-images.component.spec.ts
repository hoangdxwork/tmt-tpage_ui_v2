import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageUploadImagesComponent } from './tpage-upload-images.component';

describe('TpageUploadImagesComponent', () => {
  let component: TpageUploadImagesComponent;
  let fixture: ComponentFixture<TpageUploadImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageUploadImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageUploadImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
