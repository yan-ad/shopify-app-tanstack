import {authenticate} from '../shopify.server';
import {getOffers} from '../offers.server';

type LoaderFunctionArgs = {request: Request};
type ActionFunctionArgs = {request: Request};

// The loader responds to preflight requests from Shopify
export const loader = async ({request}: LoaderFunctionArgs) => {
  await authenticate.public.checkout(request);
};

export const action = async ({request}: ActionFunctionArgs) => {
  const {cors, sessionToken} = await authenticate.public.checkout(request);

  const offers = getOffers(sessionToken.dest);
  return cors({offers});
};
