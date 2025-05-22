import { TestBed } from '@angular/core/testing';

import { IFrameCacheService } from './iframe-cache.service';

describe('IFrameCacheService', () => {
  let service: IFrameCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IFrameCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
