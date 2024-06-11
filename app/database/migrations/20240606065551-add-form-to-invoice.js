"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "formId", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "forms",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropColumn("invoices", "formId");
  },
};
