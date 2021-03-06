'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_subject', {
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      SubjectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Subjects",
          key: "id"
        }
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        }
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_subject');
  }
};
