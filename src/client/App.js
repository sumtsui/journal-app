import React from 'react';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostNew from './components/PostNew';
import PostEdit from './components/PostEdit';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { useQuery } from '@apollo/react-hooks';
import { Switch, Route } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import Layout from './components/Layout';
import gql from 'graphql-tag';
import { ThemeProvider } from 'styled-components';

function App() {
  const { data } = useQuery(gql`
    {
      darkMode @client
    }
  `);

  return (
    <ThemeProvider theme={{ dark: data.darkMode }}>
      <Layout>
        <Header />
        <div className="main-wrap">
          <Switch>
            <Route path="/login" render={() => <Login />}></Route>
            <Route path="/signup" render={() => <Signup />}></Route>
            <PrivateRoute path="/post/new">
              <PostNew />
            </PrivateRoute>
            <PrivateRoute path="/post/:id/edit">
              <PostEdit />
            </PrivateRoute>
            <PrivateRoute path="/post/:id">
              <PostView />
            </PrivateRoute>
            <PrivateRoute path="/">
              <PostList />
            </PrivateRoute>
          </Switch>
        </div>
        <footer></footer>
      </Layout>
    </ThemeProvider>
  );
}

export default withApollo(App);
