const express = require("express");
const {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/Customer");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(getCustomers).post(createCustomer);
router
  .route("/:customerId")
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
