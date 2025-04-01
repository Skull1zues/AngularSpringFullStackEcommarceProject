import { TestBed } from '@angular/core/testing';

import { CloneCartFormServiceService } from './clone-cart-form-service.service';

describe('CloneCartFormServiceService', () => {
  let service: CloneCartFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloneCartFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
