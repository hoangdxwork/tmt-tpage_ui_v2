import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageAddCategoryComponent } from './tpage-add-category.component';

describe('TpageAddCategoryComponent', () => {
  let component: TpageAddCategoryComponent;
  let fixture: ComponentFixture<TpageAddCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageAddCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
