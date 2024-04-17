"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("institution_drugs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
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
        onDelete: "RESTRICT",
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
      purchaseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "purchases",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      drugPurchaseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "drug_purchases",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      batchNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemNo: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      quantity: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("institution_drugs");
  },
};
