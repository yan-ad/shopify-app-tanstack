import {createRef} from 'react';
import {act} from 'react';
import {createRoot} from 'react-dom/client';

import '../../../__tests__/setup-dom-test-helper';

import {AppProxyLink} from '../AppProxyLink';
import {AppProxyProvider} from '../../AppProxyProvider';

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

describe('<AppProxyLink />', () => {
  it('throws an error if used outside of an AppProxyProvider', () => {
    // GIVEN
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // WHEN
    expect(() =>
      render(<AppProxyLink href="/my-action">Hello world</AppProxyLink>),
    ).toThrow('AppProxyLink must be used within an AppProxyProvider component');
  });

  it('adds a trailing slash if one is missing', () => {
    // WHEN
    const {container, unmount} = render(
      <AppProxyProvider appUrl="http://my-app.example.io">
        <AppProxyLink href="/my-action">Hello world</AppProxyLink>
      </AppProxyProvider>,
    );

    // THEN
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('http://localhost:3000/my-action/');
    expect(container.textContent).toContain('Hello world');

    unmount();
  });

  it("doesn't alter the href if it has a trailing slash", () => {
    // WHEN
    const {container, unmount} = render(
      <AppProxyProvider appUrl="http://my-app.example.io">
        <AppProxyLink href="/my-action/">Hello world</AppProxyLink>
      </AppProxyProvider>,
    );

    // THEN
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('http://localhost:3000/my-action/');
    expect(container.textContent).toContain('Hello world');

    unmount();
  });

  it('forwards ref to the underlying anchor element', () => {
    // GIVEN
    const ref = createRef<HTMLAnchorElement>();

    // WHEN
    const {unmount} = render(
      <AppProxyProvider appUrl="http://my-app.example.io">
        <AppProxyLink ref={ref} href="/my-action">
          Hello world
        </AppProxyLink>
      </AppProxyProvider>,
    );

    // THEN
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);

    unmount();
  });
});
