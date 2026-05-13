import {createElement} from 'react';

export function errorBoundary(error: any) {
  if (
    error.constructor.name === 'ErrorResponse' ||
    error.constructor.name === 'ErrorResponseImpl'
  ) {
    return createElement('div', {
      dangerouslySetInnerHTML: {__html: error.data || 'Handling response'},
    });
  }

  throw error;
}
