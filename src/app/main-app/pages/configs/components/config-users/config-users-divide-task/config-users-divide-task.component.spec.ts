import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUsersDivideTaskComponent } from './config-users-divide-task.component';

describe('ConfigUsersDivideTaskComponent', () => {
  let component: ConfigUsersDivideTaskComponent;
  let fixture: ComponentFixture<ConfigUsersDivideTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigUsersDivideTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUsersDivideTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
