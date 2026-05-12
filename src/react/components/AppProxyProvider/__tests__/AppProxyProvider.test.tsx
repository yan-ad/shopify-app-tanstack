import {act, useContext} from 'react';
import {createRoot} from 'react-dom/client';

import '../../../__tests__/setup-dom-test-helper';

import {AppProxyProvider, AppProxyProviderContext} from '../AppProxyProvider';

function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(ui);
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
}

describe('<AppProxy />', () => {
  const defaultProps = {
    appUrl: 'test_app_url',
  };

  it('renders the script tag if the embedded app prop is passed in', () => {
    // WHEN
    const {container, unmount} = render(
      <AppProxyProvider {...defaultProps}>Hello world</AppProxyProvider>,
    );

    // THEN
    const base = container.querySelector('base');
    expect(base).not.toBeNull();
    expect(base?.getAttribute('href')).toBe(defaultProps.appUrl);
    expect(container.textContent).toContain('Hello world');

    unmount();
  });
});

describe('formatUrl', () => {
  function TestComponent({url}: {url?: string}) {
    const context = useContext(AppProxyProviderContext);

    return <div>{context?.formatUrl(url)}</div>;
  }

  it('returns undefined if no URL is given', () => {
    // WHEN
    const {container, unmount} = render(
      <AppProxyProvider appUrl="test_url">
        <TestComponent url={undefined} />
      </AppProxyProvider>,
    );

    // THEN
    expect(container.querySelector('div')?.textContent).toBe('');

    unmount();
  });
});
