"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("consultations", "serviceId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "services",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.changeColumn("consultations", "label", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn("consultations", "price", {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("consultations", "serviceId");
  },
};
