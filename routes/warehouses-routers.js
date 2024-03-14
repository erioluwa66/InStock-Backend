const router = require("express").Router();
const warehousesController = require("../controllers/warehouses-controller");
const inventoriesController = require("../controllers/inventories-controller");

<<<<<<< HEAD
router
    .route("/inventories")
    .get(inventoriesController.getInventories);
=======
router.route("/inventory").get(inventoriesController.getInventories);

router.route("/warehouses").get(warehousesController.getWarehouses);
>>>>>>> develop

router
    .route("/warehouses/:id")
    .get(warehousesController.findOneWarehouse);

router
    .route("/inventories/:id")
    .get(inventoriesController.getOneInventory);

module.exports = router;
