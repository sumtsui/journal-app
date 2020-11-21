import gql from 'graphql-tag';

const POST_FIELDS = gql`
  fragment PostFields on Post {
    title
    content
    id
    createdAt
    updatedAt
    author
  }
`;

const USER_FIELDS = gql`
  fragment UserFields on User {
    email
    settings {
      theme
      compactMode
      notifications
    }
  }
`;

export const MAIN_PAGE = gql`
  query PostList($filter: PostFilter) {
    postList(filter: $filter) {
      list {
        ...PostFields
      }
      cursor
    }
    me {
      ...UserFields
    }
  }
  ${POST_FIELDS}
  ${USER_FIELDS}
`;

export const POST_LIST = gql`
  query PostList($filter: PostFilter) {
    postList(filter: $filter) {
      list {
        ...PostFields
      }
      cursor
    }
  }
  ${POST_FIELDS}
`;

export const CREATE_POST = gql`
  mutation CreatePost($newPost: NewPostInput!) {
    createPost(input: $newPost) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $post: PostInput!) {
    updatePost(id: $id, input: $post) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const POST = gql`
  query Post($id: ID!) {
    post(id: $id) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

export const LOGIN = gql`
  mutation Login($userInput: UserInput!) {
    login(userInput: $userInput) {
      ...UserFields
      token
    }
  }
  ${USER_FIELDS}
`;

export const SIGNUP = gql`
  mutation Signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
      ...UserFields
      token
    }
  }
  ${USER_FIELDS}
`;
