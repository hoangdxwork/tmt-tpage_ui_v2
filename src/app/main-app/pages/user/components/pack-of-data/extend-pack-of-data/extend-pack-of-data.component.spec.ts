import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendPackOfDataComponent } from './extend-pack-of-data.component';

describe('ExtendPackOfDataComponent', () => {
  let component: ExtendPackOfDataComponent;
  let fixture: ComponentFixture<ExtendPackOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendPackOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendPackOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
