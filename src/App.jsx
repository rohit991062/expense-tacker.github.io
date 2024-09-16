import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AuthPage from './components/AuthPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreviousExpenses, setShowPreviousExpenses] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
        if (user) {
          fetchExpenses(user);
        } else {
          setShowPreviousExpenses(false); // Reset view when user logs out
        }
      },
      (error) => {
        console.error("Error checking auth state:", error.message);
        setError("Error checking authentication status. Please try again.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchExpenses = async (user) => {
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
    }
  };

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

  const handleViewPreviousExpenses = () => {
    setShowPreviousExpenses(true);
  };

  const handleBackToCurrentExpenses = () => {
    setShowPreviousExpenses(false); // Switch back to the default view
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-red-500">{error}</p>
          </div>
        ) : user ? (
          <>
            <Navbar onViewPreviousExpenses={handleViewPreviousExpenses} />
            <main className="flex-1 p-4">
              {showPreviousExpenses ? (
                <>
                  <button
                    className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
                    onClick={handleBackToCurrentExpenses}
                  >
                    Back to Current Expenses
                  </button>
                  <ExpenseTable
                    expenses={expenses}
                    loading={loading}
                    error={error}
                    totalExpenditure={totalExpenditure}
                    onDelete={handleDelete}
                  />
                </>
              ) : (
                <>
                  <ExpenseForm onAddExpense={handleAddExpense} />
                  <ExpenseTable
                    expenses={expenses}
                    loading={loading}
                    error={error}
                    totalExpenditure={totalExpenditure}
                    onDelete={handleDelete}
                  />
                </>
              )}
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
