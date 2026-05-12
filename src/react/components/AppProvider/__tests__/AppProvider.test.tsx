import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {vi} from 'vitest';

import '../../../__tests__/setup-dom-test-helper';

import {AppProvider} from '../AppProvider';

// Mock react-router's useNavigate hook
const mockNavigate = jest.fn();
vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual('@tanstack/react-router')),
  useNavigate: () => mockNavigate,
}));

describe('<AppProvider />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (children: React.ReactNode) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(children);
    });

    return {
      container,
      unmount() {
        act(() => {
          root.unmount();
        });
        container.remove();
      },
    };
  };

  describe.each([
    [false, undefined],
    [undefined, undefined],
  ])('when embedded is %s & apiKey is %s', (embedded, apiKey) => {
    it('renders children', () => {
      // WHEN
      const {container, unmount} = renderWithRouter(
        <AppProvider embedded={embedded as any} apiKey={apiKey as any}>
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      expect(
        container.querySelector(
          'script[src="https://cdn.shopify.com/shopifycloud/app-bridge.js"]',
        ),
      ).toBeNull();
      expect(container.textContent).toContain('Hello world');

      unmount();
    });

    it('renders the app-bridge-ui-experimental script', () => {
      // WHEN
      const {container, unmount} = renderWithRouter(
        <AppProvider embedded={embedded as any} apiKey={apiKey as any}>
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      expect(
        container.querySelector(
          'script[src="https://cdn.shopify.com/shopifycloud/polaris.js"]',
        ),
      ).not.toBeNull();

      unmount();
    });

    it('does not render the app bridge script', () => {
      // WHEN
      const {container, unmount} = renderWithRouter(
        <AppProvider embedded={embedded as any} apiKey={apiKey as any}>
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      expect(
        container.querySelector(
          'script[src="https://cdn.shopify.com/shopifycloud/app-bridge.js"]',
        ),
      ).toBeNull();

      unmount();
    });
  });

  describe('when embedded is true & apiKey is provided', () => {
    it('renders children', () => {
      // WHEN
      const {container, unmount} = renderWithRouter(
        <AppProvider embedded apiKey="test-api-key">
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      expect(container.textContent).toContain('Hello world');

      unmount();
    });

    it('renders the app-bridge-ui-experimental script', () => {
      // WHEN
      const {container, unmount} = renderWithRouter(
        <AppProvider embedded apiKey="test-api-key">
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      expect(
        container.querySelector(
          'script[src="https://cdn.shopify.com/shopifycloud/polaris.js"]',
        ),
      ).not.toBeNull();

      unmount();
    });

    it('renders the app bridge script', () => {
      // WHEN
      const {container, unmount} = renderWithRouter(
        <AppProvider embedded apiKey="test-api-key">
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      const appBridgeScript = container.querySelector(
        'script[src="https://cdn.shopify.com/shopifycloud/app-bridge.js"]',
      );
      expect(appBridgeScript).not.toBeNull();
      expect(appBridgeScript?.getAttribute('data-api-key')).toBe('test-api-key');

      unmount();
    });

    it('sets up navigation event listener', () => {
      // GIVEN
      const apiKey = 'test-api-key';
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      // WHEN
      const {unmount} = renderWithRouter(
        <AppProvider embedded apiKey={apiKey}>
          <div>Hello world</div>
        </AppProvider>,
      );

      // THEN
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'shopify:navigate',
        expect.any(Function),
      );

      unmount();
    });

    it('handles navigation events correctly', () => {
      // GIVEN
      const apiKey = 'test-api-key';
      const handlers = {
        navigate: null as ((event: Event) => void) | null,
      };

      jest
        .spyOn(document, 'addEventListener')
        .mockImplementation((event, handler) => {
          if (event === 'shopify:navigate') {
            handlers.navigate = handler as (event: Event) => void;
          }
        });

      // WHEN
      const {unmount} = renderWithRouter(
        <AppProvider embedded apiKey={apiKey}>
          <div>Hello world</div>
        </AppProvider>,
      );

      const mockEvent = {
        target: {
          getAttribute: jest.fn().mockReturnValue('/test-path'),
        },
      } as unknown as Event;

      handlers.navigate?.(mockEvent);

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith({href: '/test-path'});

      unmount();
    });

    it('cleans up event listener on unmount', () => {
      // GIVEN
      const apiKey = 'test-api-key';
      const removeEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );

      // WHEN
      const component = renderWithRouter(
        <AppProvider embedded apiKey={apiKey}>
          <div>Hello world</div>
        </AppProvider>,
      );

      component.unmount();

      // THEN
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'shopify:navigate',
        expect.any(Function),
      );
    });
  });
});
