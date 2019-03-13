const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now()
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'public'
  },
  tags: {
    type: [String],
    default: []
  },
  categories: {
    type: [String],
    default: []
  },
  titleImagePath: {
    type: String,
    default: []
  }
});

const Post = module.exports = mongoose.model('posts', PostSchema);

module.exports.getPostById = function (id) {
  return Post.findById(id);
}

module.exports.getPostsByQuery = function (pageSize, currentPage) {
  let query = Post.find();
  if (pageSize && currentPage) {
    query.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  return query;
}

module.exports.getPosts = function () {
  return Post.find();
}

module.exports.addPost = function (newPost) {
  return newPost.save();
}

module.exports.updatePost = function (postId, updatePost) {
 return Post.updateOne({
    _id: postId
  }, updatePost);
}


module.exports.deletePost = function (postId) {
  return Post.deleteOne({
    _id: postId
  });
}
