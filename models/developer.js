const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class Developer extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}
Developer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4],
      },
    },
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newDeveloperData) {
        newDeveloperData.password = await bcrypt.hash(newDeveloperData.password, 10);
        return newDeveloperData;
      },
      // set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedDeveloperData) {
        updatedDeveloperData.password = await bcrypt.hash(
          updatedDeveloperData.password,
          10
        );
        return updatedDeveloperData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "developer",
  }
);

module.exports = Developer;
