export type RedirectInit = number | ResponseInit;

export function redirect(url: string, init: RedirectInit = 302): Response {
  const responseInit = typeof init === 'number' ? {status: init} : init;
  const headers = new Headers(responseInit.headers);
  headers.set('Location', url);

  return new Response(null, {
    ...responseInit,
    headers,
    status: responseInit.status ?? 302,
  });
}