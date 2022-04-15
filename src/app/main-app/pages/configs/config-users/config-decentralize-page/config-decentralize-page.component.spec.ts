import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDecentralizePageComponent } from './config-decentralize-page.component';

describe('ConfigDecentralizePageComponent', () => {
  let component: ConfigDecentralizePageComponent;
  let fixture: ComponentFixture<ConfigDecentralizePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigDecentralizePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDecentralizePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
