import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCrossCheckingModalComponent } from './manual-cross-checking-modal.component';

describe('ManualCrossCheckingModalComponent', () => {
  let component: ManualCrossCheckingModalComponent;
  let fixture: ComponentFixture<ManualCrossCheckingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualCrossCheckingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCrossCheckingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
