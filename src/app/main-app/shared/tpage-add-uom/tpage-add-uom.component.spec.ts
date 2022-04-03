import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageAddUomComponent } from './tpage-add-uom.component';

describe('TpageAddUomComponent', () => {
  let component: TpageAddUomComponent;
  let fixture: ComponentFixture<TpageAddUomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageAddUomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageAddUomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
