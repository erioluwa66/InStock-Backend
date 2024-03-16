const router = require("express").Router();
const warehousesController = require("../controllers/warehouses-controller");
const inventoriesController = require("../controllers/inventories-controller");

router.route("/inventory").get(inventoriesController.getInventories);

router.route("/warehouses").get(warehousesController.getWarehouses);

router
  .route("/warehouses/:id")
  .get(warehousesController.findOneWarehouse)
  .delete(warehousesController.removeWarehouse);

router
  .route("/inventories/:id")
  .get(inventoriesController.getOneInventory)
  .delete(inventoriesController.removeInventory)
  .put(inventoriesController.Validator, inventoriesController.editInventory);

router.route("/warehouses").post(warehousesController.addNewWarehouse);

router.route("/warehouses/:id").put(warehousesController.editWarehouse);

router
  .route("/warehouses/:id/inventories")
  .get(warehousesController.getWarehouseInventories);

module.exports = router;
