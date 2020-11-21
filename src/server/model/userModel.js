const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { newToken } = require('../utils');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    settings: {
      theme: {
        type: String,
        required: true,
        default: 'light',
      },
      notifications: {
        type: Boolean,
        required: true,
        default: true,
      },
      compactMode: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

const User = mongoose.model('user', userSchema);

function getUserToReturn(mongooseUserObj) {
  const user = mongooseUserObj.toObject();
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;

  const token = newToken({
    email: user.email,
    password: user.password,
    id: user._id,
  });
  delete user.password;

  return { ...user, token };
}

module.exports = {
  get: (id) => {
    return User.findById(id).select('-password');
  },
  login: async ({ email, password }) => {
    try {
      const userResult = await User.findOne({ email });

      if (!userResult) {
        throw new Error('No user found.');
      }

      const match = await userResult.checkPassword(password);

      if (!match) {
        throw new Error('Incorrect password.');
      }

      return getUserToReturn(userResult);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  signup: async (newUser) => {
    try {
      const userResult = await User.create(newUser);

      return getUserToReturn(userResult);
    } catch (e) {
      console.error(e);
      if (e.message.includes('duplicate key error')) throw new Error('Email already exists.');
    }
  },
};
