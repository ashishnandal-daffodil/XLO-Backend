import { TokenAuthorizationMiddleware } from './token-authorization.middleware';

describe('TokenAuthorizationMiddleware', () => {
  it('should be defined', () => {
    expect(new TokenAuthorizationMiddleware()).toBeDefined();
  });
});
