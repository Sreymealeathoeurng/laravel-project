import React from 'react';
import { 
  FaBook,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBookOpen
} from 'react-icons/fa';
import Logo from '../assets/images/logo.png';

const Header = ({ activeTab, onTabChange }) => {

  return (
    <div className='header'>
      <div className="genres-session">
        <section className="container-fluid">
          <div className="logo1" style={{width:'34%',height:'220px'}}>
            <img src={Logo} alt="Company Logo" style={{width:'20%',height:'100%'}}  />
          </div>
          <div className="dashboard-header">
            <details className="dropdown">
              <summary className="avatar">
                <img
                  src="https://gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                  alt="User Avatar" 
                />
                <span className="username">John Carter</span>
                <p className="role">Author</p>
              </summary>
              <ul>
                <li className="profile-info">
                  <p>
                    <span className="block bold">Jane Doe</span>
                    <span className="block italic">jane@example.com</span>
                  </p>
                </li>
                
                <li 
                  className={activeTab === 'MyBook' ? 'active' : ''}
                  onClick={() => onTabChange('MyBook')}
                >
                  <div className="menu-item">
                    <FaBookOpen className="icon" /> 
                    <span>My Books</span>
                  </div>
                </li>
                
                <li 
                  className={activeTab === 'MyLibrary' ? 'active' : ''}
                  onClick={() => onTabChange('MyLibrary')}
                >
                  <div className="menu-item">
                    <FaBook className="icon" /> 
                    <span>My Library</span>
                  </div>
                </li>
                
                <li onClick={{}}>
                  <div className="menu-item">
                    <FaUser className="icon" /> 
                    <span>Account</span>
                  </div>
                </li>
                
                <li>
                  <div className="menu-item">
                    <FaCog className="icon" /> 
                    <span>Settings</span>
                  </div>
                </li>
                
                <li>
                  <div className="menu-item">
                    <FaQuestionCircle className="icon" /> 
                    <span>Help</span>
                  </div>
                </li>
                
                <li className="divider"></li>
                
                <li className="logout">
                  <div className="menu-item">
                    <FaSignOutAlt className="icon" /> 
                    <span>Logout</span>
                  </div>
                </li>
              </ul>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Header;