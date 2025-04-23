// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/money_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema & Model
const expenseSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  date: String,
});

const Expense = mongoose.model('Expense', expenseSchema);

// POST: Add Expense
app.post('/api/expenses', async (req, res) => {
  const { category, amount, date } = req.body;
  try {
    const newExpense = new Expense({ category, amount, date });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch All Expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove an Expense by ID
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
