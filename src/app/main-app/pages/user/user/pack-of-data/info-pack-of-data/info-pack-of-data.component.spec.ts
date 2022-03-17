import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPackOfDataComponent } from './info-pack-of-data.component';

describe('InfoPackOfDataComponent', () => {
  let component: InfoPackOfDataComponent;
  let fixture: ComponentFixture<InfoPackOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPackOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPackOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
