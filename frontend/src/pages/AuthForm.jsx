import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';
import LoginForm from './LoginForm'; // Ensure this path is correct
import SignupForm from './SignupForm'; // Ensure this path is correct
import '../assets/styling/form.scss';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Optionally navigate to the respective path if needed
    navigate(isLogin ? '/signup' : '/login'); // Adjust paths as necessary
  };

  return (
    <MDBContainer className="RegisterContainer">
      <nav className="auth-navigation">
        <div className="login-btn">
          <button 
            aria-label="Login" 
            onClick={() => { setIsLogin(true); navigate('/login'); }}
            className={isLogin ? 'active' : ''}
          >
            <span className="box">Login</span>
          </button>
          <button 
            aria-label="Sign up" 
            onClick={() => { setIsLogin(false); navigate('/signup'); }}
            className={!isLogin ? 'active' : ''}
          >
            <span className="box">Sign up</span>
          </button>
        </div>
      </nav>
      
      {isLogin ? <LoginForm toggleForm={toggleForm} /> : <SignupForm toggleForm={toggleForm} />}
    </MDBContainer>
  );
};

export default AuthForm;