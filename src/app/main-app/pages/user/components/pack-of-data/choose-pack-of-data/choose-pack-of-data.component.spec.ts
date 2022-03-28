import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePackOfDataComponent } from './choose-pack-of-data.component';

describe('ChoosePackOfDataComponent', () => {
  let component: ChoosePackOfDataComponent;
  let fixture: ComponentFixture<ChoosePackOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosePackOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePackOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
