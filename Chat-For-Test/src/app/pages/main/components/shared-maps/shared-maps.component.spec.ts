import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMapsComponent } from './shared-maps.component';

describe('ViewPhotoComponent', () => {
  let component: SharedMapsComponent;
  let fixture: ComponentFixture<SharedMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
