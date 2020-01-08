import { TestBed, async, inject } from '@angular/core/testing';

import { MatOAuthSecurityGuardGuard } from './mat-oauth-security-guard.guard';

describe('MatOAuthSecurityGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatOAuthSecurityGuardGuard]
    });
  });

  it('should ...', inject([MatOAuthSecurityGuardGuard], (guard: MatOAuthSecurityGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
