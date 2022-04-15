import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddMadeInModalComponent } from './config-add-made-in-modal.component';

describe('ConfigAddMadeInModalComponent', () => {
  let component: ConfigAddMadeInModalComponent;
  let fixture: ComponentFixture<ConfigAddMadeInModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAddMadeInModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddMadeInModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
