"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("form_exams", "price");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("form_exams", "price", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: null,
    });
  },
};
