import { TestBed } from '@angular/core/testing';

import { ToastrNotificationService } from './tostr-notification.service';

describe('TostrService', () => {
  let service: ToastrNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
