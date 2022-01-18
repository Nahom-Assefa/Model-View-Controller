const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [5],
    },
  },
  developer_id: {
    types: DataTypes.INTEGER,
    references: {
      model: "developer",
      key: "id",
    },
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "post",
      key: "id",
    },
  },
},
{
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
  }
);

module.exports = Comment;
