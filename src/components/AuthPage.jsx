import { Link } from 'react-router-dom';

function AuthPage() {
  return (
    <main 
      className="flex items-center justify-center h-screen bg-center bg-cover" 
      style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/expense-tracker-86f95.appspot.com/o/yf1gkk8q.png?alt=media&token=71d1127d-3fbc-47ce-8959-8e240674ecb1)' }}
      aria-label="Authentication Page"
    >
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg bg-opacity-90">
        <h1 className="mb-4 text-4xl font-bold text-green-600 sm:text-3xl">
          Welcome to PennyWise
        </h1>
        <p className="mb-8 text-lg text-gray-700 sm:text-base">
          Effortlessly track your expenses and manage your finances with ease.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <Link 
            to="/signup" 
            className="px-4 py-2 text-white transition bg-green-600 rounded shadow hover:bg-green-700"
            aria-label="Sign Up"
          >
            Sign Up
          </Link>
          <Link 
            to="/login" 
            className="px-4 py-2 text-white transition bg-blue-600 rounded shadow hover:bg-blue-700"
            aria-label="Login"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
