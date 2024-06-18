"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "form_drugs",
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
        formId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "forms",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        patientId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "patients",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        quantity: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        prescription: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        givenQuantity: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
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
    await queryInterface.dropTable("form_drugs");
  },
};
