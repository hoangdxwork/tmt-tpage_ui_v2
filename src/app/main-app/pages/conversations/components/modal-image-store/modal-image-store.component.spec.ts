import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImageStoreComponent } from './modal-image-store.component';

describe('ModalImageStoreComponent', () => {
  let component: ModalImageStoreComponent;
  let fixture: ComponentFixture<ModalImageStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImageStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImageStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
