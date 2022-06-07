import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShipOrderInfoModalComponent } from './update-ship-order-info-modal.component';

describe('UpdateShipOrderInfoModalComponent', () => {
  let component: UpdateShipOrderInfoModalComponent;
  let fixture: ComponentFixture<UpdateShipOrderInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateShipOrderInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateShipOrderInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
