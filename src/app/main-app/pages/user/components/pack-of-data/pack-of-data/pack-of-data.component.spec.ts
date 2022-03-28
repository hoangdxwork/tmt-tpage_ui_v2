import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackOfDataComponent } from './pack-of-data.component';

describe('PackOfDataComponent', () => {
  let component: PackOfDataComponent;
  let fixture: ComponentFixture<PackOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
