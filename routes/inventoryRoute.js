const router = require("express").Router();
const inventoriesController = require("../controllers/inventories-controller");

router.route("/inventory").get(inventoriesController.getInventories);

router
    .route("/inventories/:id")
    .get(inventoriesController.getOneInventory);


module.exports = router;