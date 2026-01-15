const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

// ➕ ADD EXPENSE
exports.addExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category) {
    return res.status(400).json({
      success: false,
      message: "Title, amount and category are required",
    });
  }

  const expense = await Expense.create({
    title,
    amount,
    category: category.toLowerCase(),
    date: date || new Date(),

    // user attach
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Expense added",
    expense,
  });
});

// 📥 GET EXPENSES
exports.getExpenses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { category, startDate,endDate } = req.query;

  // build dynamic filter object
  const filter = {
    user: req.user._id,  
  };

  if(category){
    filter.category = category.toLowerCase();
  }

  if(startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $gte: new Date(endDate),
    };
  }
  const total = await Expense.countDocuments(filter);

  const expenses = await Expense.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    totalExpenses: total,
    count: expenses.length,
    expenses,
  });
});


// 📊 MONTHLY SUMMARY
exports.getMonthlySummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({
      success: false,
      message: "month and year are required",
    });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const expenses = await Expense.find({
    user:req.user._id, //user filter
    date: { $gte: startDate, $lt: endDate },
  });

  let totalAmount = 0;
  const byCategory = {};

  expenses.forEach((e) => {
    totalAmount += e.amount;
    byCategory[e.category] =
      (byCategory[e.category] || 0) + e.amount;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    byCategory,
  });
});
