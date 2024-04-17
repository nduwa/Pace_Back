"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "purchases",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        institutionId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "institutions",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        note: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        supplier: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        drugsCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        totalCost: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        paranoid: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("purchases");
  },
};
