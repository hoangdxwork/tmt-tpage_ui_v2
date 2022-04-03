import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageSearchUOMComponent } from './tpage-search-uom.component';

describe('TpageSearchUOMComponent', () => {
  let component: TpageSearchUOMComponent;
  let fixture: ComponentFixture<TpageSearchUOMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageSearchUOMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageSearchUOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
