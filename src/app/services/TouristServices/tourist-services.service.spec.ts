import { TestBed } from '@angular/core/testing';

import { TouristServicesService } from './tourist-services.service';

describe('TouristServicesService', () => {
  let service: TouristServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouristServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
