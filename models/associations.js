const Developer = require("./developer");
const Post = require("./post");
const Comment = require("./comment");

// Create associations
Developer.hasMany(Post, {
  foreignKey: "developer_id",
  onDelete: 'cascade',
});

Post.belongsTo(Developer, {
  foreignKey: "developer_id",
  onDelete: 'cascade',
});

Comment.belongsTo(Developer, {
  foreignKey: "developer_id",
  onDelete: 'cascade',
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: 'cascade',
});

Developer.hasMany(Comment, {
  foreignKey: "developer_id",
  onDelete: 'cascade',
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: 'cascade',
});

module.exports = { Developer, Post, Comment };


