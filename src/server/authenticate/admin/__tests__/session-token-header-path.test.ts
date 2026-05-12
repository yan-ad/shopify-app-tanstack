import {shopifyApp} from '../../..';
import {
  APP_URL,
  BASE64_HOST,
  TEST_SHOP,
  getJwt,
  getThrownResponse,
  setUpValidSession,
  testConfig,
} from '../../../__test-helpers';

describe('authorize.session token header path', () => {
  describe('errors', () => {
    it('throws a 401 if the session token is invalid', async () => {
      // GIVEN
      const shopify = shopifyApp(testConfig());

      // WHEN
      const response = await getThrownResponse(
        shopify.authenticate.admin,
        new Request(`${APP_URL}?shop=${TEST_SHOP}&host=${BASE64_HOST}`, {
          headers: {Authorization: 'Bearer im-a-valid-token-promise'},
        }),
      );

      // THEN
      expect(response.status).toBe(401);
    });
  });

  describe.each([true, false])(
    'success cases when isOnline: %s',
    (isOnline) => {
      it('does not write decoded session token payloads to logs', async () => {
        // GIVEN
        const log = jest.fn();
        const shopify = shopifyApp({
          ...testConfig({
            logger: {log},
            useOnlineTokens: isOnline,
          }),
        });

        await setUpValidSession(shopify.sessionStorage, {isOnline});

        // WHEN
        const {token, payload} = await getJwt();
        await shopify.authenticate.admin(
          new Request(`${APP_URL}?shop=${TEST_SHOP}&host=${BASE64_HOST}`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
        );

        // THEN
        const logMessages = log.mock.calls
          .map(([, message]) => String(message))
          .join('\n');

        expect(logMessages).not.toContain(JSON.stringify(payload));
        expect(logMessages).not.toContain(token);
        expect(logMessages).not.toContain('payload:');
        expect(logMessages).not.toContain('sessionToken:');
        expect(logMessages).toContain(
          'Session token is valid - validated | {shop: test-shop.myshopify.com}',
        );
        expect(logMessages).toContain(
          'Session token is valid - authenticated | {shop: test-shop.myshopify.com}',
        );
      });

      it('returns context when session exists for embedded apps', async () => {
        // GIVEN
        const shopify = shopifyApp({
          ...testConfig({useOnlineTokens: isOnline}),
        });

        const testSession = await setUpValidSession(shopify.sessionStorage, {
          isOnline,
        });

        // WHEN
        const {token, payload} = await getJwt();
        const {sessionToken, session} = await shopify.authenticate.admin(
          new Request(`${APP_URL}?shop=${TEST_SHOP}&host=${BASE64_HOST}`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
        );

        // THEN
        expect(sessionToken).toEqual(payload);
        expect(session).toBe(testSession);
      });
    },
  );
});
