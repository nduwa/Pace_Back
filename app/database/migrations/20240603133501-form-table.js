"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "forms",
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
          allowNull: false,
          references: {
            model: "patients",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        formNO: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        at: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        details: {
          type: Sequelize.JSON,
          defaultValue: {},
        },
        isOpen: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
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
    await queryInterface.dropTable("forms");
  },
};
