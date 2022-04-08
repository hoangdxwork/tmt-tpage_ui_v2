import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPagesBasicComponent } from './config-pages-basic.component';

describe('ConfigPagesBasicComponent', () => {
  let component: ConfigPagesBasicComponent;
  let fixture: ComponentFixture<ConfigPagesBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPagesBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPagesBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
