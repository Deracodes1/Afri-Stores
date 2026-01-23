import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userAccountRoutesGuard } from './user-account-routes-guard';

describe('userAccountRoutesGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userAccountRoutesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
