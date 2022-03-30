import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageMenuLayoutComponent } from './tpage-menu-layout.component';

describe('TdsMenuLayoutComponent', () => {
  let component: TpageMenuLayoutComponent;
  let fixture: ComponentFixture<TpageMenuLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageMenuLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageMenuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
