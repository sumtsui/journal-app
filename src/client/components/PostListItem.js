import React from 'react';
import styled, { css } from 'styled-components';

const ListItem = styled.div`
  margin-bottom: 2em;
  background: transparent;
  &:hover {
    text-decoration: underline;
  }
  a {
    color: #000;
  }
  ${props =>
    props.theme.dark &&
    css`
      a {
        color: #fff;
      }
    `};
`;

export default ListItem;
