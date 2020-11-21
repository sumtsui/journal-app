import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useApolloClient } from 'react-apollo';
import gql from 'graphql-tag';

function PrivateRoute({ children, ...rest }) {
  const client = useApolloClient();
  const { isLogin } = client.readQuery({
    query: gql`
      {
        isLogin @client
      }
    `
  });

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLogin ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signup',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
