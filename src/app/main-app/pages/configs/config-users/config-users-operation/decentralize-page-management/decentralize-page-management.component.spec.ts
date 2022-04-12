import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecentralizePageManagementComponent } from './decentralize-page-management.component';

describe('DecentralizePageManagementComponent', () => {
  let component: DecentralizePageManagementComponent;
  let fixture: ComponentFixture<DecentralizePageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecentralizePageManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecentralizePageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
