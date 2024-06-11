"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoices", "drugsCount");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "drugsCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },
};
