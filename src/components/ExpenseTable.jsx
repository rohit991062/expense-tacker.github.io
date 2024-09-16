import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

function ExpenseTable({ expenses, loading, error, totalExpenditure, onDelete }) {
  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : expenses.length === 0 ? (
        <p>No expenses for this month or previous month.</p>
      ) : (
        <div>
          <table className="min-w-full mb-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left border-b">Expense Name</th>
                <th className="px-4 py-2 text-right border-b">Amount</th>
                <th className="px-4 py-2 text-left border-b">Category</th>
                <th className="px-4 py-2 text-left border-b">Date</th>
                <th className="px-4 py-2 text-center border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{expense.name}</td>
                  <td className="px-4 py-2 text-right border-b">${expense.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 border-b">{expense.category}</td>
                  <td className="px-4 py-2 border-b">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center border-b">
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-right">Total Expenditure: ${totalExpenditure.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseTable;
