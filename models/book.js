'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class book extends Model {
        static associate(models) {


            // Book has many favorites
            book.hasMany(models.favorite, { foreignKey: 'bookId' });
        }
    }

    book.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        imageLinks: {
            type: DataTypes.JSON,
            allowNull: true
        },
        pageCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'book',
        tableName: 'books'
    });

    return book;
};
