const router = require("express").Router();
const warehousesController = require("../controllers/warehouses-controller");


router.route("/warehouses").get(warehousesController.getWarehouses);

router
    .route("/warehouses/:id")
    .get(warehousesController.findOneWarehouse);



module.exports = router;
