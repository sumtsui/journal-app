import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { SIGNUP } from '../apollo/graphql';
import { withApollo } from 'react-apollo';
import { useHistory, useLocation, Link } from 'react-router-dom';

function Signup({ client }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otherError, setError] = useState('');
  const [signup, { data, error, loading }] = useMutation(SIGNUP);
  const history = useHistory();
  const location = useLocation();

  const onSaveClick = evt => {
    evt.preventDefault();
    signup({
      variables: { userInput: { email, password } }
    }).catch(e => {
      setError(e.message);
    });
  };

  useEffect(() => {
    if (!data || !data.signup) return;
    localStorage.setItem('token', data.signup.token);
    client.writeData({
      data: {
        isLogin: true
      }
    });
    const { from } = location.state || { from: { pathname: '/' } };
    history.replace(from);
  }, [data, client]);

  if (loading) return <div>Signing up...</div>;

  return (
    <>
      {otherError && (
        <div className="error-message">
          <span>{otherError.replace('GraphQL error: ', '')}</span>
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
            Sign up
          </button>
        </div>
      </form>
      <Link className="instead" to="/login">
        Log in instead
      </Link>
    </>
  );
}

export default withApollo(Signup);
