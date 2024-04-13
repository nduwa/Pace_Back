"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "drugs",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        institutionId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "institutions",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        drug_code: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        designation: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        instruction: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        sellingUnit: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        isOnMarket: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
    await queryInterface.dropTable("drugs");
  },
};
