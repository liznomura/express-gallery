module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
  {timestamps: false},
  {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.photos);
      }
    }
  });

  return Users;
};