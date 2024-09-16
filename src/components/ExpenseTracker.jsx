import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const month = new Date().toISOString().slice(0, 7); // Current month
        try {
          const expensesCollection = collection(db, 'users', user.uid, 'expenses');
          const q = query(
            expensesCollection,
            where('month', 'in', [month, getPreviousMonth()])
          );
          const snapshot = await getDocs(q);
          const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setExpenses(expensesData);
          // Calculate total expenditure
          const total = expensesData.reduce((acc, expense) => acc + expense.amount, 0);
          setTotalExpenditure(total);
        } catch (error) {
          console.error("Error fetching expenses:", error.message);
          setError("Error fetching expenses. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExpenses();
  }, []);

  const getPreviousMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7); // YYYY-MM
  };

  const handleAddExpense = (newExpense) => {
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    setTotalExpenditure(prevTotal => prevTotal + newExpense.amount);
  };

  const handleDelete = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
        // Recalculate total expenditure after deletion
        const total = updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpenditure(total);
      }
    } catch (error) {
      console.error("Error deleting expense:", error.message);
      setError("Error deleting expense. Please try again.");
    }
  };

  return (
    <div>
      <ExpenseForm onAddExpense={handleAddExpense} />
      <ExpenseTable
        expenses={expenses}
        loading={loading}
        error={error}
        totalExpenditure={totalExpenditure}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ExpenseTracker;
