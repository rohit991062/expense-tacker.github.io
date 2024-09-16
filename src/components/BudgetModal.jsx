import { useState } from 'react';

function BudgetModal({ onSetBudget }) {
  const [budget, setBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSetBudget(parseFloat(budget));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Set Monthly Budget</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Monthly Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="py-2 text-white transition bg-green-600 rounded shadow hover:bg-green-700"
          >
            Set Budget
          </button>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;
