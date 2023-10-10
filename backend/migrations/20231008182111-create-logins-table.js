'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('logins', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expiration_hours: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      expiration_minutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      user_id: {
        type: Sequelize.INTEGER, // Assuming it's the foreign key to the User model
        references: {
          model: 'users', // Update with your actual User table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Add any other fields you may need here
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('logins');
  }
};
