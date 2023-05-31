'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('books', 'imageLinks', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await queryInterface.addColumn('books', 'pageCount', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('books', 'imageLinks');
    await queryInterface.removeColumn('books', 'pageCount');
  }
};
