module.exports = function (sequelize, DataTypes) {
  var Worker = sequelize.define("Worker", {
    name: {
      type: DataTypes.STRING,
      isAlpha: true,
      len: [2, 40]
    },
    image: {
      type: DataTypes.STRING
    },
    specialty: {
      type: DataTypes.STRING,
      isAlpha: true
    },
    hourly_rate: {
      type: DataTypes.INTEGER,
      min: 10,
      max: 100
    },
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    distance: DataTypes.INTEGER,
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      min: 1,
      max: 5,
      defaultValue: 3
    },
    latitude: DataTypes.DECIMAL(20, 10),
    longitude: DataTypes.DECIMAL(20, 10)
  });

  Worker.associate = function (models) {
    Worker.hasMany(models.Review, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Worker;
};
