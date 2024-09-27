"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "services",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        label: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        level: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        desc: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        assignDuringOrientation: {
          type: Sequelize.STRING,
          allowNull: false,
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
    await queryInterface.dropTable("services");
  },
};
