const Developer = require("./developer");
const Post = require("./post");
const Comment = require("./comment");

// Create associations
Developer.hasMany(Post, {
  foreignKey: "developer_id",
});

Post.belongsTo(Developer, {
  foreignKey: "developer_id",
});

Comment.belongsTo(Developer, {
  foreignKey: "developer_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

Developer.hasMany(Comment, {
  foreignKey: "developer_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});

module.exports = { Developer, Post, Comment };

