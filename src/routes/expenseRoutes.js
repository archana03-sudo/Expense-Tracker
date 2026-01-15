const express = require("express");
const {
  addExpense,
  getExpenses,
  getMonthlySummary,
} = require("../controllers/expenseController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, addExpense);
router.get("/", protect, getExpenses);
router.get("/summary", protect, getMonthlySummary);

module.exports = router;
