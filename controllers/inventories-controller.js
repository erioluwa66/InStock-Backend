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
      .where({ "inventories.id": req.params.id });

    if (data.length === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    res
      .status(500)
      .send(`Unable to fetch inventory data with ID ${req.params.id}`);
  }
};

const addNewInventoryItem = async (req, res) => {
  const { item_name, description, category, quantity, warehouse_id } = req.body;
  if (!item_name || !description || !category || !quantity || !warehouse_id) {
    return res.status(400).send("Please provide all required fields");
  }

  try {
    const warehouseExists = await knex("warehouses")
      .where("id", warehouse_id)
      .first();
    if (!warehouseExists) {
      return res.status(400).send("Invalid warehouse selection");
    }

    knex("inventories")
      .insert(req.body)
      .then((result) => {
        const id = result[0];
        res.status(201).send({ id, ...req.body });
      })
      .catch((err) => {
        res.status(500).send("Error in creating new item");
      });
  } catch (err) {
    res.status(500).send("Error in creating new item");
  }
};

module.exports = {
  getInventories,
  getOneInventory,
  addNewInventoryItem,
};
