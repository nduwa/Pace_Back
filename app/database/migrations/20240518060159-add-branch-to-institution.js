"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("institutions", "institutionId", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "institutions",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropColumn("institutions", "institutionId");
  },
};
