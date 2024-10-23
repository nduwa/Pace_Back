"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "form_acts",
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
        institutionId: {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "institutions",
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
        formConsultationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "form_consultations",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        done: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
        comment: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "",
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

    await queryInterface.dropTable("form_exams");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("form_acts");

    await queryInterface.createTable(
      "form_exams",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        examId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "exams",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        institutionId: {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
          references: {
            model: "institutions",
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
        result: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
        comment: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "",
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
};
