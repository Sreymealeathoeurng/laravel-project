import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style/sideBar.scss';

import CommunityContent from './CommunityContent';
import SettingsContent from './SettingsContent';
import LibraryContent from './LibraryContent';
import AnalyticsContent from './AnalyticsContent';
import NavItem from './NavItem';
import NavItemWithSubMenu from './NavItemWithSubMenu';
import BooksContent from './BooksContent'; // Import BooksContent here

const AuthorDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subMenu, setSubMenu] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Books');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => navigate(path);
  const toggleSubMenu = (name) => setSubMenu(prev => ({ ...prev, [name]: !prev[name] }));
  const handleItemClick = (title, path = null) => {
    setActiveItem(title);
    if (path) navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'Books': return <BooksContent />;
      case 'My Library': return <LibraryContent />;
      case 'Analytics': return <AnalyticsContent />;
      case 'Community': return <CommunityContent />;
      case 'Settings': return <SettingsContent />;
      default: return <BooksContent />;
    }
  };

  return (
    <div className={`wrapper1 ${isOpen ? 'close' : ''} ${isMobile ? 'mobile' : ''}`}>
      {isMobile && isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
      <div className="sidebar">
        <div className="logo-details">
          <i className='bx bxs-book-alt'></i>
          <span className="logo_name">AuthorPro</span>
          <i className='bx bx-x close-icon' onClick={() => setIsOpen(false)} />
        </div>
        <ul className="nav-links">
          <NavItemWithSubMenu
            title="Books"
            icon="bx bx-book"
            subItems={[
              { name: 'Create New', path: '/create-story' },
              { name: 'Published Works', path: '/dashboard/books/published' }
            ]}
            toggleSubMenu={() => toggleSubMenu('books')}
            isOpen={subMenu.books}
            active={activeItem === 'Books'}
            onClick={() => handleItemClick('Books')}
            location={location}
          />
          <NavItem
            title="My Library"
            icon="bx bx-library"
            active={activeItem === 'My Library'}
            onClick={() => handleItemClick('My Library')}
            location={location}
            path="/dashboard/library"
          />
        { /* <NavItem
            title="Community"
            icon="bx bx-group"
            active={activeItem === 'Community'}
            onClick={() => handleItemClick('Community')}
            location={location}
            path="/dashboard/community"
          />*/}
          <NavItem
            title="Settings"
            icon="bx bx-cog"
            active={activeItem === 'Settings'}
            onClick={() => handleItemClick('Settings')}
            location={location}
            path="/dashboard/settings"
          />
          <NavItem
            title="Genres"
            icon="bx bx-category"
            active={false}
            onClick={() => handleItemClick('Genres', '/genres')}
            location={location}
          />
          <NavItem
            title="Home"
            icon="bx bx-home"
            active={false}
            onClick={() => handleItemClick('Home', '/home')}
            location={location}
          />
        </ul>

    
      </div>

      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default AuthorDashboard;