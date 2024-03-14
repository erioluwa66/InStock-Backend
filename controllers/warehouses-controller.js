const knex = require('knex')(require('../knexfile'));

const findOneWarehouse = async (req, res) => {
    try {
      const warehouseFound = await knex("warehouses")
        .where({ id: req.params.id });
  
      if (warehouseFound.length === 0) {
        return res.status(404).json({
          message: `Warehouse with ID ${req.params.id} not found` 
        });
      }
  
      const warehouseData = {
        "id": warehouseFound[0].id,
        "warehouse_name": warehouseFound[0].warehouse_name,
        "address": warehouseFound[0].address,
        "city": warehouseFound[0].city,
        "country": warehouseFound[0].country,
        "contact_name": warehouseFound[0].contact_name, 
        "contact_position": warehouseFound[0].contact_position,
        "contact_phone": warehouseFound[0].contact_phone,
        "contact_email": warehouseFound[0].contact_email
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
      })
    }
  }

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
		contact_email
	} = req.body;
  if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
    return res.status(400).send("Please provide all required fields")}

  if (!contact_email.includes("@") || !contact_email.includes(".")) {
    return res.status(400).send("Please enter a valid email")
  }

  if(contact_phone.length < 10) {
    return res.status(400).send("Please enter a valid phone number");
  }

  knex("warehouses")
    .insert(req.body)
    .then((result) => {
      const id = result[0];
      res.status(201).send({id, ...req.body });
    })
    .catch((error) => {
      res.status(500).send(`Error in creating warehouse: ${error}`);
    });
  };

  //Edit Warehouse
  const editWarehouse = async (req, res) => {
	
	const { 
		warehouse_name,
		address,
		city,
		country,
		contact_name,
		contact_position,
		contact_phone,
		contact_email
	} = req.body;
  if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
    return res.status(400).send("Please provide all required fields")};

  if (!contact_email.includes("@") || !contact_email.includes(".")) {
    return res.status(400).send("Please enter a valid email")
  };

  if(contact_phone.length < 10) {
    return res.status(400).send("Please enter a valid phone number");
  };

  try {
    const updatedRows = await knex("warehouses")
    .update(req.body)
    where({ id: req.params.id });

  if (updatedRows === 0){
    return res.status(404).send(`Warehouse with ID of ${req.params.id} does not exist, please use accurate info`)
  }

  res.status(200).send({
    id: req.params.id,
    ...req.body,
  });
} catch (error) {
  res.status(400).send(`Error updating warehouse with id ${req.params.id}: ${error}`);
}
};

  module.exports = {
    findOneWarehouse,
    getWarehouses,
    addNewWarehouse,
    editWarehouse,
  };

