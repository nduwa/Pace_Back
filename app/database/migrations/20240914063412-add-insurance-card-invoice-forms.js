"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("forms", "insuranceId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "institutions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("forms", "insuranceCard", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("invoices", "insuranceCard", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("forms", "insuranceCard");
    await queryInterface.removeColumn("forms", "insuranceId");
    await queryInterface.removeColumn("invoices", "insuranceCard");
  },
};
