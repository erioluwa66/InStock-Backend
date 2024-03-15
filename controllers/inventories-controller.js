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

const getOneInventory = async (req, res) => {
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
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where ({ "inventories.id": req.params.id });
      
      if (data.length === 0) {
        return res.status(404).json({
          message: `Inventory with ID ${req.params.id} not found` 
        });
      }

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).send(`Unable to fetch inventory data with ID ${req.params.id}`);
  }
};

//delete an inventory
const removeInventory = async (req, res) => {
  try {
    const rowsDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete inventory: ${error}`,
    });
  }
};

module.exports = {
  getInventories,
  getOneInventory,
  removeInventory
};
