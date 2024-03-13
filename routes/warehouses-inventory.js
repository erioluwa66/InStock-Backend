const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');
const inventoriesController = require("../controllers/inventories-controller");

router.route("/inventories").get(inventoriesController.index);


module.exports = router;