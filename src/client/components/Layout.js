import React from 'react';
import styled, { css } from 'styled-components';

const Layout = styled.div`
  background: #fff;
  min-height: 100vh;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;

  a {
    color: #000;
  }

  transition: background-color 0.6s;
  * {
    transition: background-color 0.6s;
  }

  header {
    display: flex;
    justify-content: space-between;
    width: 70%;
    margin: auto;
    padding: 2em 0;
    a {
      color: #000;
    }
    .title {
      font-size: 1.4em;
    }
    .buttons {
      button:not(:last-child) {
        margin-right: 0.6em;
      }
    }
  }

  .single-post.edit {
    .title,
    .content {
      border: 2px solid #4d4d4d61;
      border-radius: 5px;
    }
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    input {
      max-width: 200px;
      margin-bottom: 2em;
    }
  }

  .instead {
    margin-top: 2em;
    display: inline-block;
    text-decoration: underline;
  }

  .error-message {
    span {
      background-color: #eba2db;
      color: black;
    }
    margin-bottom: 2em;
  }

  ${props =>
    props.theme.dark &&
    css`
      background: black;
      color: white;
      a {
        color: #fff;
      }
      header {
        a {
          color: #b9b9b9;
        }
      }
      .single-post.edit {
        .title,
        .content {
          border: 2px solid #adadad61;
          background: #000;
          color: #fff;
        }
      }
    `};
`;

export default Layout;
