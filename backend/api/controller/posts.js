const Post = require('../models/post');

// Add a post
exports.createPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    allowComments: req.body.allowComments,
    status: req.body.status,
    tags: req.body.tags.split(','),
    categories: req.body.categories.split(','),
    titleImagePath: req.body.titleImagePath
  });

  Post.addPost(newPost)
    // Post created?
    .then((post) => res.status(201).json({
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        date: post.date,
        allowComments: post.allowComments,
        status: post.status,
        tags: post.tags,
        categories: post.categories,
        titleImagePath: post.titleImagePath
      },
      message: 'Post created'
    }))
    // Error while creating?
    .catch(err => res.status(500).json({
      success: false,
      message: 'Failed to add post'
    }));
}

// Get Posts
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  // Build the query
  Post.getPostsByQuery(pageSize, currentPage)
    .then(posts => {
      fetchedPosts = posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          creator: post.creator,
          date: post.date,
          allowComments: post.allowComments,
          status: post.status,
          tags: post.tags.join(),
          categories: post.categories.join(),
          titleImagePath: post.titleImagePath
        };
      });
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Get successfully!',
        maxPosts: count,
        posts: fetchedPosts
      });
    })
    .catch(err =>
      res.status(500).json({
        success: false,
        message: 'Fetching posts failed.'
      }));
}


// Get One Post
exports.getPost = (req, res, next) => {
  // Build the query
  Post.getPostById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'No post found.'
        });
      }
      res.status(200).json({
        message: 'Get successfully!',
        post: {
          id: post._id,
          title: post.title,
          content: post.content,
          creator: post.creator,
          date: post.date,
          allowComments: post.allowComments,
          status: post.status,
          tags: post.tags.join(),
          categories: post.categories.join(),
          titleImagePath: post.titleImagePath
        }
      });
    });
}


// Update Post
exports.updatePost = (req, res, next) => {
  const newPost = new Post({
    id: req.params.id,
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    allowComments: req.body.allowComments,
    status: req.body.status,
    tags: req.body.tags.split(','),
    categories: req.body.categories.split(','),
    titleImagePath: req.body.titleImagePath
  });
  console.log(newPost);

  Post.updatePost(req.params.id, newPost)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post updated successfully.'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Not authorized.'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Updating the post failed.'
      });

    });
}

// Delete Post
exports.deletePost = (req, res, next) => {
  Post.deletePost(req.params.id)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post deleted successfully.'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Not authorized.'
        });
      }
    })
    .catch(err => res.status(500).json({
      success: false,
      message: 'Deleting a post failed.'
    }));
}
