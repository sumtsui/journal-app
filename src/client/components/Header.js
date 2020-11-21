import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import { Link, useHistory } from 'react-router-dom';
import gql from 'graphql-tag';

function Header() {
  const client = useApolloClient();
  const history = useHistory();
  const { data } = useQuery(gql`
    {
      isLogin @client
      darkMode @client
    }
  `);

  // TODO: remove cache
  async function signout() {
    client.resetStore();
    history.push('/login');
    localStorage.removeItem('token');
  }

  function toggleDarkMode() {
    const { darkMode } = client.readQuery({
      query: gql`
        {
          darkMode
        }
      `
    });
    client.writeData({
      data: {
        darkMode: !darkMode
      }
    });
    // !darkMode is the current value of darkMode after user toggling it.
    if (!darkMode === true) localStorage.setItem('darkMode', 1);
    else localStorage.removeItem('darkMode');
  }

  return (
    <header
      className="header"
      style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Link to="/">
        <h1 className="title">Journal</h1>
      </Link>
      <div className="buttons">
        {data.isLogin && <button onClick={signout}>Logout</button>}
        <button onClick={toggleDarkMode}>{data.darkMode ? 'Light' : 'Dark'}</button>
      </div>
    </header>
  );
}

export default Header;
