export interface HeadersArgs {
	parentHeaders?: Headers;
	loaderHeaders?: Headers;
	actionHeaders?: Headers;
	errorHeaders?: Headers;
}

export type ErrorBoundary = (error: unknown) => string | never;
export type HeadersBoundary = (headers: HeadersArgs) => Headers;
