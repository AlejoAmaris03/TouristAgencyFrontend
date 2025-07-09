import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristServicesComponent } from './tourist-services.component';

describe('TouristServicesComponent', () => {
  let component: TouristServicesComponent;
  let fixture: ComponentFixture<TouristServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
