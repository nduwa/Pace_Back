"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("institution_drugs", "purchaseId");
    await queryInterface.removeColumn("institution_drugs", "drugPurchaseId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("institution_drugs", "purchaseId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "purchases",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("institution_drugs", "drugPurchaseId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "drug_purchases",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
