const express = require("express");

const router = express.Router();

const {
  getAllVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
} = require("../controllers/voucher-management.controller.js");

router.get("/all", getAllVouchers);

router.post("/add", addVoucher);

router.put("/update", updateVoucher),

router.delete("/delete/:id", deleteVoucher);

module.exports = router;
