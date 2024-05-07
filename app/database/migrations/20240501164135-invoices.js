"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "invoices",
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
        patientId: {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "patients",
          },
          onDelete: "SET NULL",
          onUpdate: "SET NULL",
        },

        userId: {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "users",
          },
          onDelete: "SET NULL",
          onUpdate: "SET NULL",
        },
        invoiceNO: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        note: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING,
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
    await queryInterface.dropTable("invoices");
  },
};
