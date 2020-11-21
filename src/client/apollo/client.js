import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { toIdValue } from 'apollo-utilities';

const isDev = process.env.NODE_ENV === 'development';
const url = isDev ? 'http://localhost:5001/' : '/';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      post: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Post', id: args.id }))
    }
  }
});

const httpLink = new HttpLink({ uri: `${url}graphql` });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message === 'Login required.') {
        localStorage.removeItem('token');
        window.location.reload();
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const resolvers = {
  isLogin() {
    return !!localStorage.getItem('token');
  }
};

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache,
  resolvers
});

function initCache() {
  client.writeData({
    data: {
      isLogin: !!localStorage.getItem('token'),
      darkMode: !!localStorage.getItem('darkMode')
    }
  });
}

initCache();

client.onResetStore(() => {
  console.log('onResetStore');
  initCache();
});

export default client;
