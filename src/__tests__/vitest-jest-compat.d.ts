import type {Mock as VitestMock, vi} from 'vitest';

import type FetchMock from '../server/__test-helpers/fetch-mock';

declare global {
  const jest: typeof vi;
  const fetchMock: typeof FetchMock;
  const IS_REACT_ACT_ENVIRONMENT: boolean;
}

export type JestMock<
  T extends (...args: any[]) => any = (...args: any[]) => any,
> = VitestMock<T>;

export {};
