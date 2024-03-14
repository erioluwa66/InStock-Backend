const router = require("express").Router();
const warehousesController = require("../controllers/warehouses-controller");
const inventoriesController = require("../controllers/inventories-controller");

router
    .route("/inventories")
    .get(inventoriesController.getInventories);

router
    .route("/warehouses/:id")
    .get(warehousesController.findOneWarehouse);

router
    .route("/inventories/:id")
    .get(inventoriesController.getOneInventory);

module.exports = router;
