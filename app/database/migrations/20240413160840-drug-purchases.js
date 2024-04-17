"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "drug_purchases",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        drugId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "drugs",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        unitPrice: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        sellingPrice: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        totalPrice: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        purchaseId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "purchases",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        paranoid: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("drug_purchases");
  },
};
