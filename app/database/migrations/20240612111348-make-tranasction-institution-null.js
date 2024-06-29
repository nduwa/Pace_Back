"use strict";

/** @type {import('sequelize').Sequelize } */
const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("transactions", "institutionId", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("transactions", "institutionId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
