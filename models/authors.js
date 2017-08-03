module.exports = function(sequelize, DataTypes) {
  var Authors = sequelize.define("authors", {
    author: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
  {timestamps: false},
  {
    classMethods: {
      associate: function(models) {
        Authors.hasMany(models.Photos);
      }
    }
  });

  return Authors;
};