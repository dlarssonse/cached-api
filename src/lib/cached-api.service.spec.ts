import { TestBed } from '@angular/core/testing';

import { CachedAPIService } from './cached-api.service';

describe('CachedAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CachedAPIService = TestBed.get(CachedAPIService);
    expect(service).toBeTruthy();
  });
});
