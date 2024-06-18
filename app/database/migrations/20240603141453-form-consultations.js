"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "form_consultations",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        consultationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "consultations",
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
        userId: {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "users",
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
        verdict: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        invoiceId: {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "invoices",
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
    await queryInterface.dropTable("form_consultations");
  },
};
