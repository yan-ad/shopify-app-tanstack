import {vi} from 'vitest';

export interface MockParams extends ResponseInit {
  url?: string;
}

interface QueuedResponse {
  body: string;
  init?: MockParams;
}

const queuedResponses: QueuedResponse[] = [];

const mockedFetch = vi.fn(async () => {
  const next = queuedResponses.shift();
  if (!next) {
    return new Response('');
  }

  return new Response(next.body, next.init);
});

const fetchMock = {
  get mock() {
    return mockedFetch.mock;
  },
  enableMocks() {
    globalThis.fetch = mockedFetch as unknown as typeof fetch;
    globalThis.fetchMock = this;
  },
  mockResponse(body: string, init?: MockParams) {
    queuedResponses.push({body, init});
  },
  mockResponses(...responses: [string, MockParams][]) {
    for (const [body, init] of responses) {
      queuedResponses.push({body, init});
    }
  },
  resetMocks() {
    queuedResponses.length = 0;
    mockedFetch.mockReset();
  },
  mockReset() {
    this.resetMocks();
  },
};

export default fetchMock;
