const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Post = mongoose.model('post', postSchema);

const generateModel = (user) => ({
  readAll: (filter = {}) => {
    const { cursor = 0 } = filter;
    const limit = 30;
    if (!user) throw new Error('Login required.');
    const list = Post.find({ author: user.email }, null, { limit, skip: cursor }).sort({ createdAt: -1 });
    return {
      list,
      cursor: cursor + limit,
    };
  },
  readOne: (id) => {
    if (!user) throw new Error('Login required.');
    return Post.findOne({ _id: id, author: user.email });
  },
  create: (input) => {
    if (!user) throw new Error('Login required.');
    input.author = user.email;
    return Post.create(input);
  },
  update: (input, id) => {
    if (!user) throw new Error('Login required.');
    return Post.findOneAndUpdate({ _id: id, author: user.email }, input, {
      new: true,
      useFindAndModify: false,
    });
  },
  delete: async (id) => {
    if (!user) throw new Error('Login required.');
    const res = await Post.deleteOne({ _id: id, author: user.email });

    if (res.ok && res.deletedCount === 1) return id;
    return null;
  },
});

module.exports = generateModel;
