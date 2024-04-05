"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "institutions",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        institutionType: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        admin: {
          type: Sequelize.JSON,
          defaultValue: {},
        },
        details: {
          type: Sequelize.JSON,
          defaultValue: {},
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        paranoid: false,
      }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("institutions");
  },
};
