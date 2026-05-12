import {vi} from 'vitest';

import fetchMock from '../server/__test-helpers/fetch-mock';

// Keep existing tests working while migrating from jest.* APIs.
globalThis.jest = vi;

// Must run before source modules import the Shopify web adapter.
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.mockReset();
});
