import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch expenses from backend on load
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(response.data);
        const total = response.data.reduce((sum, exp) => sum + exp.amount, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    const trimmedCategory = category.trim();
    const parsedAmount = Number(amount);

    if (!trimmedCategory) {
      alert('Please enter a category.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/expenses', {
        category: trimmedCategory,
        amount: parsedAmount,
        date,
      });

      const newExpense = response.data;
      setExpenses([...expenses, newExpense]);
      setTotalAmount(totalAmount + newExpense.amount);

      setCategory('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (index) => {
    const expenseToDelete = expenses[index];

    try {
      await axios.delete(`http://localhost:5000/api/expenses/${expenseToDelete._id}`);

      const updatedExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(updatedExpenses);
      setTotalAmount(totalAmount - expenseToDelete.amount);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="App">
      <h1>Money Tracker Web App</h1>

      <div className="input-section">
        <label htmlFor="category-input">Category:</label>
        <input
          type="text"
          id="category-input"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <label htmlFor="amount-input">Amount:</label>
        <input
          type="number"
          id="amount-input"
          placeholder="₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="date-input">Date:</label>
        <input
          type="date"
          id="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button id="add-btn" onClick={handleAddExpense}>
          Add
        </button>
      </div>

      <div className="expenses-list">
        <h2>Expenses List</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody id="expense-table-body">
            {expenses.map((expense, index) => (
              <tr key={expense._id}>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{expense.date}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteExpense(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total:</td>
              <td id="total-amount">{totalAmount}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button id="print-btn" onClick={handlePrint}>
        Print Expenses
      </button>
    </div>
  );
}

export default App;
