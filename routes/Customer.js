const express = require("express");
const {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/Customer");
const { protect, suspanded } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(protect,suspanded, getCustomers).post(protect, suspanded,createCustomer);
router
  .route("/:customerId")
  .get(protect, suspanded,getCustomer)
  .put(protect, suspanded,updateCustomer)
  .delete(protect, suspanded,deleteCustomer);

module.exports = router;
