import React, { useState } from 'react';
import { FaBookReader, FaPenFancy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Book/styling/create.scss';

const ChooseForm = ({ onRoleSelect }) => {
  const navigate = useNavigate();

  // ❗ FIX: Add selectedRole state
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (onRoleSelect) onRoleSelect(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      alert('Please select a role.');
      return;
    }

    // Save selected role in localStorage
    localStorage.setItem('selected_role', selectedRole);

    // Optional: Go to signup or login
    navigate('/signup'); // Change to '/login' if needed
  };

  return (
    <div className="role-selection-container">
      <h2>Welcome to StoryCraft</h2>
      <p className="subtitle">Are you here to read or create?</p>

      <form onSubmit={handleSubmit}>
        <div className="role-options">
          <div
            className={`role-card ${selectedRole === 'reader' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('reader')}
          >
            <div className="role-icon reader">
              <FaBookReader size={48} />
            </div>
            <h3>Reader</h3>
            <p>Discover stories and join discussions.</p>
          </div>

          <div
            className={`role-card ${selectedRole === 'author' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('author')}
          >
            <div className="role-icon author">
              <FaPenFancy size={48} />
            </div>
            <h3>Author</h3>
            <p>Write and publish your own stories.</p>
          </div>
        </div>

        <button
          type="submit"
          className="continue-button"
          disabled={!selectedRole || isLoading}
        >
          {isLoading ? 'Loading...' : `Continue as ${selectedRole || '...'}`}
        </button>
      </form>
    </div>
  );
};

export default ChooseForm;
