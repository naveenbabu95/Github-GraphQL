import { inject } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { environment } from '@environment';

const uri = environment.GITHUB_GRAPHQL_BASE_URL;
export function createApollo(): ApolloClientOptions<any> {
  console.log(uri);
  const httpLink = inject(HttpLink);
  const http = httpLink.create({ uri });
  const auth = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${environment.GITHUB_AUTH_TOKEN}`,
      },
    };
  });
  console.log('Apollo client created');
  return {
    link: auth.concat(http),
    cache: new InMemoryCache(),
  };
}
