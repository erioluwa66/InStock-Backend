const knex = require("knex")(require("../knexfile"));
const { findWarehouseById } = require("./warehouses-controller");

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

// Middleware to validate PUT /inventories/:id request
const Validator = async (req, res, next) => {
  const { item_name, description, category, status, quantity, warehouse_id } =
    req.body;

  if (
    !item_name ||
    !description ||
    !category ||
    !status ||
    !quantity ||
    !warehouse_id
  ) {
    return res.status(400).send("Please provide all required fields");
  }

  // if (Number(quantity) < 0){
  //   return res.status(400).send("Please input correct quantity number");
  // }
  const quantityRegex = /^\d+$/;
  if (!quantityRegex.test(quantity)) {
    return res.status(400).send("Please enter a valid quantity number");
  }

  try {
    //also need validate whether warehouse_id value does exist in the warehouses table
    const warehouse = await findWarehouseById(warehouse_id);
    if (!warehouse) {
      return res.status(400).send({ message: "Warehouse ID does not exist." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while validating warehouse ID." });
  }

  next();
};

//Edit Inventory
const editInventory = async (req, res) => {
  try {
    const updatedRows = await knex("inventories")
      .update(req.body)
      .where({ id: req.params.id });

    if (updatedRows === 0) {
      return res
        .status(404)
        .send(
          `Inventory with ID of ${req.params.id} does not exist, please use accurate info`
        );
    }

    const updatedInventory = await knex("inventories")
      .select(
        "inventories.id",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .from("inventories")
      .where({
        id: req.params.id,
      });

    res.status(200).json(updatedInventory[0]);
  } catch (error) {
    res
      .status(500)
      .send(`Error updating Inventory with id ${req.params.id}: ${error}`);
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
  removeInventory,
  editInventory,
  Validator,
  addNewInventoryItem,
};
