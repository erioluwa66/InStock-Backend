const knex = require("knex")(require("../knexfile"));

const findOneWarehouse = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = {
      id: warehouseFound[0].id,
      warehouse_name: warehouseFound[0].warehouse_name,
      address: warehouseFound[0].address,
      city: warehouseFound[0].city,
      country: warehouseFound[0].country,
      contact_name: warehouseFound[0].contact_name,
      contact_position: warehouseFound[0].contact_position,
      contact_phone: warehouseFound[0].contact_phone,
      contact_email: warehouseFound[0].contact_email,
    };
    res.json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

const getWarehouses = async (req, res) => {
  try {
    const warehouseData = await knex("warehouses").select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    );
    res.status(200).json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving warehouses data: ${error}`,
    });
  }
};

// Add new warehouse
const addNewWarehouse = (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  )
    return res.status(400).send("Please provide all required fields");

  if (!contact_email.includes("@") || !contact_email.includes(".")) {
    return res.status(400).send("Please enter a valid email");
  }

  if (contact_phone.length < 10) {
    return res.status(400).send("Please enter a valid phone number");
  }

  knex("warehouses")
    .insert(req.body)
    .then((result) => {
      const id = result[0];
      res.status(201).send({ id, ...req.body });
    })
    .catch((err) => {
      res.status(500).send("Error in creating warehouse");
    });
};

//delete a warehouse
const removeWarehouse = async (req, res) => {
  try {
    const rowsDeleted = await knex("warehouses")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }

    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete warehouse: ${error}`,
    });
  }
};

//GET inventories for a given warehouse
const getWarehouseInventories = async (req, res) => {
  const warehouseId = req.params.id;
  try {
    //check if the warehouse exists
    const warehouse = await knex("warehouses").where("id", warehouseId).first();
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    //Retreive all inventories for the given warehouse ID
    const inventories = await knex("inventories")
      .where("warehouse_id", warehouseId)
      .select("id", "item_name", "category", "status", "quantity");

    res.status(200).json(inventories);
  } catch (error) {
    console.error("Error retreiving inventories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  findOneWarehouse,
  getWarehouses,
  addNewWarehouse,
  removeWarehouse,
  getWarehouseInventories,
};
