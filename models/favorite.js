'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class favorite extends Model {
        static associate(models) {
            // Favorite belongs to a user
            favorite.belongsTo(models.user, { foreignKey: 'userId' });

            // Favorite belongs to a book
            favorite.belongsTo(models.book, { foreignKey: 'bookId' });
        }

    }

    favorite.init(
        {
            // Define attributes here that correspond to the columns in the "favorites" table
            // For example:
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            bookId: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        },
        {
            sequelize,
            modelName: 'favorite',
            tableName: 'favorites'
        }
    );

    return favorite;
};
