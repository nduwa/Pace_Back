"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "invoice_acts",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        serviceActId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "exams",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        invoiceId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "invoices",
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
        price: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        insuranceCost: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        patientCost: {
          type: Sequelize.FLOAT,
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
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        paranoid: true,
      }
    );
    await queryInterface.dropTable("invoice_exams");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invoice_acts");

    await queryInterface.createTable(
      "invoice_acts",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        serviceActId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "acts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        invoiceId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "invoices",
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

        price: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        insuranceCost: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },

        patientCost: {
          type: Sequelize.FLOAT,
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
};
