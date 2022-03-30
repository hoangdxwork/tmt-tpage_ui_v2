import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigQuickRepliesComponent } from './config-quick-replies.component';

describe('ConfigQuickRepliesComponent', () => {
  let component: ConfigQuickRepliesComponent;
  let fixture: ComponentFixture<ConfigQuickRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigQuickRepliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigQuickRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
