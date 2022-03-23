import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpageTeamDropdownComponent } from './tpage-team-dropdown.component';

describe('TpageTeamDropdownComponent', () => {
  let component: TpageTeamDropdownComponent;
  let fixture: ComponentFixture<TpageTeamDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpageTeamDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpageTeamDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
