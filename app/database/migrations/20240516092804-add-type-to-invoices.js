"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "type", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "PHARMACETICAL_RECORD",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoices", "type");
  },
};
