import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCampaignComponent } from './livecampaign.component';

describe('LivecampaignComponent', () => {
  let component: LiveCampaignComponent;
  let fixture: ComponentFixture<LiveCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveCampaignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
