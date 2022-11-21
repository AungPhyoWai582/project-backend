const express = require("express");
const {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/Customer");
const { protect, suspended } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(protect,suspended, getCustomers).post(protect, suspended,createCustomer);
router
  .route("/:customerId")
  .get(protect, suspended,getCustomer)
  .put(protect, suspended,updateCustomer)
  .delete(protect, suspended,deleteCustomer);

module.exports = router;
