import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Adjust path as needed
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/expenses');
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Create an Account</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded"
              aria-label="Email"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded"
              aria-label="Password"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="py-2 text-white transition bg-green-600 rounded shadow hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
