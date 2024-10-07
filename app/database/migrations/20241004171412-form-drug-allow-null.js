"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("form_drugs", "drugId");

    await queryInterface.addColumn("form_drugs", "isMaterial", {
      type: Sequelize.BOOLEAN,
      allowNull: true, // Change this to allow NULL
      defaultValue: false,
    });

    await queryInterface.addColumn("form_drugs", "drugId", {
      type: Sequelize.UUID,
      allowNull: true, // Change this to allow NULL
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addColumn("form_drugs", "insuranceDrugId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "insurance_drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addColumn("form_drugs", "institutionDrugId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "institution_drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("form_drugs", "insuranceDrugId");
    await queryInterface.removeColumn("form_drugs", "institutionDrugId");
    await queryInterface.removeColumn("form_drugs", "isMaterial");
  },
};
