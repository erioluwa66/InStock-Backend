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
  ) {
    return res.status(400).send("Please provide all required fields");
  }

  if (!contact_email.includes("@") || !contact_email.includes(".")) {
    return res.status(400).send("Please enter a valid email");
  }

  const phoneRegex = /^\+\d{1,3} \(\d{3}\) \d{3}-\d{4}$/;
  if (!phoneRegex.test(contact_phone)) {
    return res
      .status(400)
      .send(
        "Please enter a valid phone number in the format +1 (646) 123-1234"
      );
  }

  if (req.body.id) {
    return res
      .status(400)
      .send("ID cannot be provided when adding a new warehouse");
  }

  knex("warehouses")
    .insert(req.body)
    .then((result) => {
      const id = result[0];
      res.status(201).send({ id, ...req.body });
    })
    .catch((error) => {
      res.status(500).send(`Error in creating warehouse: ${error}`);
    });
};

//Edit Warehouse
const editWarehouse = async (req, res) => {
  try {
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
    ) {
      return res.status(400).send("Please provide all required fields");
    }

    if (!contact_email.includes("@") || !contact_email.includes(".")) {
      return res.status(400).send("Please enter a valid email");
    }

    const phoneRegex = /^\+\d{1,3} \(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(contact_phone)) {
      return res
        .status(400)
        .send(
          "Please enter a valid phone number in the format +1 (646) 123-1234"
        );
    }

    const id = req.params.id;

    if (req.body.id && req.body.id !== id) {
      return res.status(400).send("ID cannot be modified");
    }

    const updatedData = { ...req.body };
    delete updatedData.id; // Remove ID from updated data

    const updatedRows = await knex("warehouses")
      .update(updatedData)
      .where({ id });

    if (updatedRows === 0) {
      return res
        .status(404)
        .send(
          `Warehouse with ID of ${req.params.id} does not exist, please use accurate info`
        );
    }

    res.status(200).send({
      id: req.params.id,
      ...req.body,
    });
  } catch (error) {
    res
      .status(400)
      .send(`Error updating warehouse with id ${req.params.id}: ${error}`);
  }
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
  editWarehouse,
};
