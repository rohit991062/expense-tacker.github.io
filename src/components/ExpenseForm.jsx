import { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(''); // Default to empty string
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      if (parseFloat(amount) <= 0) {
        setError("Amount must be a positive number.");
        return;
      }
      setLoading(true);
      try {
        const month = new Date().toISOString().slice(0, 7); // Current month
        const newExpense = {
          name,
          amount: parseFloat(amount),
          category,
          date,
          month
        };
        const docRef = await addDoc(collection(db, 'users', user.uid, 'expenses'), newExpense);
        newExpense.id = docRef.id; // Add the generated ID to the new expense
        onAddExpense(newExpense); // Update the parent component's state
        // Clear the form fields after successful submission
        setName('');
        setAmount('');
        setCategory(''); // Reset to empty string
        setDate('');
        setError('');
      } catch (error) {
        console.error("Error adding expense:", error.message);
        setError(`Error adding expense: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setError("User not authenticated.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center">Add Expense</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-green-600 rounded shadow hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
