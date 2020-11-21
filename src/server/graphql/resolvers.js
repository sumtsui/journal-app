module.exports = {
  Query: {
    postList(_, { filter }, { model }) {
      return model.post.readAll(filter);
    },
    post(_, { id }, { model }) {
      return model.post.readOne(id);
    },
    me(_, __, { currentUser }) {
      if (!currentUser) throw new Error('Login required.');
      return currentUser;
    },
  },
  Post: {
    id(post) {
      return post._id.toString();
    },
  },
  Mutation: {
    signup(_, { userInput }, { model }) {
      return model.user.signup(userInput);
    },
    login(_, { userInput }, { model }) {
      return model.user.login(userInput);
    },
    createPost(_, { input }, { model }) {
      return model.post.create(input);
    },
    updatePost(_, { input, id }, { model }) {
      return model.post.update(input, id);
    },
    deletePost(_, { id }, { model }) {
      return model.post.delete(id);
    },
  },
};
