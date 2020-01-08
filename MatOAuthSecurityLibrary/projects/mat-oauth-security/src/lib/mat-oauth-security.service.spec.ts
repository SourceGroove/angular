import { TestBed } from '@angular/core/testing';

import { MatOAuthSecurityService } from './mat-oauth-security.service';

describe('MatOAuthSecurityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatOAuthSecurityService = TestBed.get(MatOAuthSecurityService);
    expect(service).toBeTruthy();
  });
});
