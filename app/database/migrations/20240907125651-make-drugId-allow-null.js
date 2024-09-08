module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("drug_purchases", "drugId");
    await queryInterface.removeColumn("invoice_drugs", "drugId");
    await queryInterface.removeColumn("institution_drugs", "drugId");

    await queryInterface.addColumn("drug_purchases", "drugId", {
      type: Sequelize.UUID,
      allowNull: true, // Change this to allow NULL
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addColumn("institution_drugs", "drugId", {
      type: Sequelize.UUID,
      allowNull: true, // Change this to allow NULL
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addColumn("invoice_drugs", "drugId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addColumn("invoice_drugs", "insuranceDrugId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "insurance_drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("drug_purchases", "drugId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.changeColumn("institution_drugs", "drugId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.changeColumn("invoice_drugs", "drugId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "drugs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.removeColumn("invoice_drugs", "insuranceDrugId");
  },
};
