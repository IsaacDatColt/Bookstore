'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('favorites', 'favorites_bookId_fkey');

    // Change the column type
    await queryInterface.changeColumn('favorites', 'bookId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('favorites', 'bookId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
