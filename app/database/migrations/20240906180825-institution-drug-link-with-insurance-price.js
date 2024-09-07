"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("institution_drugs", "insuranceDrugId", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "insurance_drugs",
      },
      onDelete: "SET NULL",
      onUpdate: "SET NULL",
    });

    await queryInterface.addColumn("drug_purchases", "insuranceDrugId", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "insurance_drugs",
      },
      onDelete: "SET NULL",
      onUpdate: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("institution_drugs", "insuranceDrugId");
    await queryInterface.removeColumn("drug_purchases", "insuranceDrugId");
  },
};
