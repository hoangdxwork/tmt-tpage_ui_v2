import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataModalComponent } from './edit-data-modal.component';

describe('EditDataModalComponent', () => {
  let component: EditDataModalComponent;
  let fixture: ComponentFixture<EditDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
