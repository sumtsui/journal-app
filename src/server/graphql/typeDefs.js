const { gql } = require('apollo-server-express');

module.exports = gql`
  type Post {
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    id: ID!
    author: String!
  }

  type MorePosts {
    list: [Post]!
    cursor: Int!
  }

  enum Theme {
    dark
    light
  }

  type Settings {
    theme: Theme!
    notifications: Boolean!
    compactMode: Boolean!
  }

  type User {
    email: String!
    settings: Settings!
    token: String # only return token when login or signup
  }

  input PostInput {
    title: String
    content: String
    createdAt: String
    updatedAt: String
  }

  input PostFilter {
    title: String
    content: String
    createdAt: String
    updatedAt: String
    skip: Int
    cursor: Int
  }

  input UserInput {
    email: String!
    password: String!
  }

  input NewPostInput {
    title: String!
    content: String!
  }

  type Query {
    postList(filter: PostFilter): MorePosts!
    me: User!
    post(id: ID!): Post!
  }

  type Mutation {
    signup(userInput: UserInput!): User!
    login(userInput: UserInput!): User!
    createPost(input: NewPostInput!): Post!
    updatePost(id: ID!, input: PostInput!): Post!
    deletePost(id: ID!): ID
  }
`;
