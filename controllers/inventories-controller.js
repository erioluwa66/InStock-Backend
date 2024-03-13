const knex = require("knex")(require("../knexfile"));

const getInventories = async (req, res) => {
  try {
    const data = await knex
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .from("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Unable to fetch inventory data: ${err}`);
  }
};

module.exports = {
  getInventories,
};
