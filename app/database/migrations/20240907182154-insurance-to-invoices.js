"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "insuranceId", {
      type: Sequelize.UUID,
      allowNull: true, // Change this to allow NULL
      references: {
        model: "institutions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("invoices", "insuranceCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.changeColumn("invoices", "totalCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoices", "patientCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoice_drugs", "insuranceCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoice_drugs", "patientCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoice_exams", "insuranceCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoice_exams", "patientCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoice_consultations", "insuranceCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("invoice_consultations", "patientCost", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoices", "insuranceId");
    await queryInterface.removeColumn("invoices", "insuranceCost");
    await queryInterface.removeColumn("invoices", "patientCost");
    await queryInterface.removeColumn("invoice_drugs", "insuranceCost");
    await queryInterface.removeColumn("invoice_drugs", "patientCost");
    await queryInterface.removeColumn("invoice_exams", "insuranceCost");
    await queryInterface.removeColumn("invoice_exams", "patientCost");
    await queryInterface.removeColumn("invoice_consultations", "insuranceCost");
    await queryInterface.removeColumn("invoice_consultations", "patientCost");
  },
};
