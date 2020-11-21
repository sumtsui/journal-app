import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../apollo/graphql';
import { withApollo } from 'react-apollo';
import { useHistory, useLocation, Link } from 'react-router-dom';

function Login({ client }) {
  const [email, setEmail] = useState('');
  const [otherError, setError] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, error, loading }] = useMutation(LOGIN);
  const history = useHistory();
  const location = useLocation();

  const onSaveClick = evt => {
    evt.preventDefault();
    login({
      variables: { userInput: { email, password } }
    }).catch(e => {
      setError(e.message);
    });
  };

  useEffect(() => {
    if (!data || !data.login) return;
    localStorage.setItem('token', data.login.token);
    client.writeData({
      data: {
        isLogin: true
      }
    });
    const { from } = location.state || { from: { pathname: '/' } };
    history.replace(from);
  }, [data, client]);

  if (loading) return <div>Logging in...</div>;

  return (
    <>
      {error && (
        <div className="error-message">
          <span>{error.message.replace('GraphQL error: ', '')}</span>
        </div>
      )}
      <form className="auth-form">
        <input
          className="email"
          placeholder="Email"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
          type="email"
          required
        />
        <input
          className="password"
          placeholder="Password"
          value={password}
          type="password"
          onChange={evt => setPassword(evt.target.value)}
          required
        />
        <div className="form-bottom">
          <button type="submit" onClick={onSaveClick}>
            Login
          </button>
        </div>
      </form>
      <Link className="instead" to="/signup">
        Sign up instead
      </Link>
    </>
  );
}

export default withApollo(Login);
