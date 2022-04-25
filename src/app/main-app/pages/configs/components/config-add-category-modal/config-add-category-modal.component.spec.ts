import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddCategoryModalComponent } from './config-add-category-modal.component';

describe('ConfigAddCategoryModalComponent', () => {
  let component: ConfigAddCategoryModalComponent;
  let fixture: ComponentFixture<ConfigAddCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
