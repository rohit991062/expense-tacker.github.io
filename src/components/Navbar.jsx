import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { auth } from '../firebase';

function Navbar({ onViewPreviousExpenses }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-green-600 shadow-md">
      <div 
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
        aria-label="Navigate to Home"
      >
        PennySmart
      </div>
      <div className="relative" ref={dropdownRef}>
        <FaUserCircle
          size={40}
          color="white"
          className="cursor-pointer"
          onClick={toggleDropdown}
          aria-label="User Menu"
        />
        {dropdownOpen && (
          <div className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-300 rounded shadow-lg">
            <button 
              onClick={() => { onViewPreviousExpenses(); closeDropdown(); }} 
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200"
              aria-label="View Previous Expenses"
            >
              View Previous Expenses
            </button>
            <button 
              onClick={() => { handleSignOut(); closeDropdown(); }} 
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200"
              aria-label="Sign Out"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
