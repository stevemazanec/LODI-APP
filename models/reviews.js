module.exports = function (sequelize, DataTypes) {
    var Review = sequelize.define("Review", {
        comment: {
            type: DataTypes.TEXT,
            isAlpha: true,
            len: [1, 300]
        },

        rating: {
            type: DataTypes.INTEGER,
            min: 1,
            max: 5
        },

        email: {
            type: DataTypes.STRING
            // isEmail: true
        },

        workername: {
            type: DataTypes.STRING
        }


    });

    Review.associate = function (models) {
        Review.belongsTo(models.Worker, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Review;
};