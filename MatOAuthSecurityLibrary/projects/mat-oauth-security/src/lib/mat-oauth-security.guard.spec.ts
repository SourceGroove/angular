import { TestBed, async, inject } from '@angular/core/testing';

import { MatOauthSecurityGuard } from 'projects/mat-oauth-security/src/lib/mat-oauth-security.guard';

describe('MatOAuthSecurityGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatOauthSecurityGuard]
    });
  });

  it('should ...', inject([MatOauthSecurityGuard], (guard: MatOauthSecurityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
