import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPagesDivideTaskComponent } from './config-pages-divide-task.component';

describe('ConfigPagesDivideTaskComponent', () => {
  let component: ConfigPagesDivideTaskComponent;
  let fixture: ComponentFixture<ConfigPagesDivideTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPagesDivideTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPagesDivideTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
