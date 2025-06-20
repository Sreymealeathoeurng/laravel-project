import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import './styling/sideBar.scss';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subMenu, setSubMenu] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Dashboard');

  const toggleSubMenu = (name) => {
    setSubMenu((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    const mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setIsOpen(!mobile);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (title) => {
    setActiveItem(title);
    if (isMobile) setIsOpen(false);
  };

  return (
    <div className={`wrapper ${isOpen ? 'close' : ''} ${isMobile ? 'mobile' : ''}`}>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className="sidebar">
        <div className="logo-details">
          <i className='bx bxs-book-alt'></i>
          <span className="logo_name">AuthorPro</span>
          <i 
            className='bx bx-x close-icon' 
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          ></i>
        </div>
        
        <ul className="nav-links">
          <NavItem 
            title="Dashboard" 
            icon="bx bx-grid-alt" 
            path="/dashboard"
            active={location.pathname === '/dashboard'}
            onClick={() => handleItemClick('Dashboard')}
          />
          
          <NavItemWithSubMenu
            title="Books"
            icon="bx bx-book"
            subItems={[
              { name: 'Create New', path: '/dashboard/books/create' },
              { name: 'Manage Books', path: '/dashboard/books/manage' },
              { name: 'Published Works', path: '/dashboard/books/published' }
            ]}
            toggleSubMenu={() => toggleSubMenu('books')}
            isOpen={subMenu.books}
            active={location.pathname.startsWith('/dashboard/books')}
            onClick={() => handleItemClick('Books')}
          />
          
          <NavItem 
            title="My Library" 
            icon="bx bx-library" 
            path="/dashboard/library"
            active={location.pathname === '/dashboard/library'}
            onClick={() => handleItemClick('My Library')}
          />
          
          <NavItemWithSubMenu
            title="Analytics"
            icon="bx bx-line-chart"
            subItems={[
              { name: 'Sales', path: '/dashboard/analytics/sales' },
              { name: 'Readers', path: '/dashboard/analytics/readers' },
              { name: 'Engagement', path: '/dashboard/analytics/engagement' }
            ]}
            toggleSubMenu={() => toggleSubMenu('analytics')}
            isOpen={subMenu.analytics}
            active={location.pathname.startsWith('/dashboard/analytics')}
            onClick={() => handleItemClick('Analytics')}
          />
          
          <NavItem 
            title="Community" 
            icon="bx bx-group" 
            path="/dashboard/community"
            active={location.pathname === '/dashboard/community'}
            onClick={() => handleItemClick('Community')}
          />
          
          <NavItem 
            title="Settings" 
            icon="bx bx-cog" 
            path="/dashboard/settings"
            active={location.pathname === '/dashboard/settings'}
            onClick={() => handleItemClick('Settings')}
          />
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile">
            <img src="https://i.pravatar.cc/80?img=12" alt="User" />
            <div className="user-info">
              <span className="name">Jane Author</span>
              <span className="role">Premium Member</span>
            </div>
            <Link to="/logout" className="logout-icon">
              <i className='bx bx-log-out'></i>
            </Link>
          </div>
        </div>
      </div>

      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <i 
              className='bx bx-menu menu-toggle' 
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            ></i>
            <h1>{activeItem}</h1>
          </div>
          <div className="header-right">
            <div className="search-box">
              <i className='bx bx-search'></i>
              <input type="text" placeholder="Search books, stats..." />
            </div>
            <div className="notifications">
              <i className='bx bx-bell'></i>
              <span className="badge">3</span>
            </div>
            <div className="user-actions">
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/40?img=12" alt="User" />
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/dashboard/books/*" element={<BooksContent />} />
            <Route path="/dashboard/library" element={<LibraryContent />} />
            <Route path="/dashboard/analytics/*" element={<AnalyticsContent />} />
            <Route path="/dashboard/community" element={<CommunityContent />} />
            <Route path="/dashboard/settings" element={<SettingsContent />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Content components
const DashboardContent = () => (
  <div className="dashboard-container">
    <div className="welcome-banner">
      <div className="welcome-text">
        <h2>Welcome back, Jane!</h2>
        <p>Here's what's happening with your books today</p>
      </div>
      <button className="btn-primary">Create New Book</button>
    </div>
    
    <div className="stats-grid">
      <StatCard 
        icon="bx bx-book" 
        title="Total Books" 
        value="24" 
        change="+3 this month" 
        changePositive={true}
      />
      <StatCard 
        icon="bx bx-user" 
        title="Readers" 
        value="1,245" 
        change="+12% this month" 
        changePositive={true}
      />
      <StatCard 
        icon="bx bx-dollar" 
        title="Revenue" 
        value="$3,450" 
        change="+8% this month" 
        changePositive={true}
      />
      <StatCard 
        icon="bx bx-star" 
        title="Avg. Rating" 
        value="4.6" 
        change="+0.2 this month" 
        changePositive={true}
      />
    </div>
    
    <div className="content-row">
      <div className="chart-container">
        <h3>Monthly Sales</h3>
        <div className="chart-placeholder">
          <i className='bx bx-bar-chart-alt'></i>
          <p>Sales chart visualization</p>
        </div>
      </div>
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          <ActivityItem 
            icon="bx bx-edit"
            text="You published 'The Midnight Tales'"
            time="2 hours ago"
          />
          <ActivityItem 
            icon="bx bx-user-plus"
            text="125 new readers this week"
            time="1 day ago"
          />
          <ActivityItem 
            icon="bx bx-star"
            text="New 5-star review for 'Ocean Dreams'"
            time="2 days ago"
          />
          <ActivityItem 
            icon="bx bx-dollar"
            text="Payment received for March royalties"
            time="3 days ago"
          />
        </ul>
      </div>
    </div>
    
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="action-buttons">
        <button className="btn-secondary">
          <i className='bx bx-plus'></i> Add New Chapter
        </button>
        <button className="btn-secondary">
          <i className='bx bx-line-chart'></i> View Analytics
        </button>
        <button className="btn-secondary">
          <i className='bx bx-envelope'></i> Message Readers
        </button>
      </div>
    </div>
  </div>
);

const BooksContent = () => (
  <div className="section-content">
    <div className="content-header">
      <h2>Books Management</h2>
      <div className="header-actions">
        <button className="btn-primary">
          <i className='bx bx-plus'></i> New Book
        </button>
        <div className="search-filter">
          <input type="text" placeholder="Search books..." />
          <select>
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>
      </div>
    </div>
    
    <div className="books-table">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Published Date</th>
            <th>Readers</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <BookRow 
            title="The Midnight Tales" 
            status="Published" 
            date="Mar 15, 2023" 
            readers="845" 
            rating="4.7" 
          />
          <BookRow 
            title="Ocean Dreams" 
            status="Published" 
            date="Jan 22, 2023" 
            readers="1,202" 
            rating="4.5" 
          />
          <BookRow 
            title="Whispers in the Dark" 
            status="Draft" 
            date="-" 
            readers="-" 
            rating="-" 
          />
          <BookRow 
            title="Summer Breeze" 
            status="Published" 
            date="Dec 5, 2022" 
            readers="932" 
            rating="4.3" 
          />
        </tbody>
      </table>
    </div>
    
    <div className="pagination">
      <button className="btn-pagination">
        <i className='bx bx-chevron-left'></i>
      </button>
      <span className="active">1</span>
      <span>2</span>
      <span>3</span>
      <button className="btn-pagination">
        <i className='bx bx-chevron-right'></i>
      </button>
    </div>
  </div>
);

const LibraryContent = () => (
  <div className="section-content">
    <div className="content-header">
      <h2>My Library</h2>
      <div className="header-actions">
        <button className="btn-primary">
          <i className='bx bx-plus'></i> Add Book
        </button>
      </div>
    </div>
    
    <div className="library-grid">
      <LibraryBook 
        title="The Midnight Tales" 
        cover="https://via.placeholder.com/150x200?text=Midnight+Tales"
        progress={75}
      />
      <LibraryBook 
        title="Ocean Dreams" 
        cover="https://via.placeholder.com/150x200?text=Ocean+Dreams"
        progress={100}
      />
      <LibraryBook 
        title="Summer Breeze" 
        cover="https://via.placeholder.com/150x200?text=Summer+Breeze"
        progress={45}
      />
      <LibraryBook 
        title="Whispers in the Dark" 
        cover="https://via.placeholder.com/150x200?text=Whispers+Dark"
        progress={10}
      />
      <LibraryBook 
        title="The Forgotten Kingdom" 
        cover="https://via.placeholder.com/150x200?text=Forgotten+Kingdom"
        progress={0}
      />
      <LibraryBook 
        title="Winter's Edge" 
        cover="https://via.placeholder.com/150x200?text=Winter's+Edge"
        progress={90}
      />
    </div>
  </div>
);

const AnalyticsContent = () => (
  <div className="section-content">
    <h2>Analytics Dashboard</h2>
    <div className="analytics-tabs">
      <button className="tab-active">Sales</button>
      <button>Readers</button>
      <button>Engagement</button>
    </div>
    
    <div className="analytics-content">
      <div className="chart-container large">
        <h3>Sales Over Time</h3>
        <div className="chart-placeholder">
          <i className='bx bx-line-chart'></i>
          <p>Sales trend visualization</p>
        </div>
      </div>
      
      <div className="metrics-row">
        <div className="metric-card">
          <h4>Total Revenue</h4>
          <p className="metric-value">$8,450</p>
          <p className="metric-change positive">+12% from last month</p>
        </div>
        <div className="metric-card">
          <h4>Books Sold</h4>
          <p className="metric-value">324</p>
          <p className="metric-change positive">+8% from last month</p>
        </div>
        <div className="metric-card">
          <h4>Avg. Price</h4>
          <p className="metric-value">$26.08</p>
          <p className="metric-change negative">-2% from last month</p>
        </div>
      </div>
      
      <div className="top-books">
        <h3>Top Performing Books</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The Midnight Tales</td>
              <td>142</td>
              <td>$3,692</td>
              <td>4.7</td>
            </tr>
            <tr>
              <td>Ocean Dreams</td>
              <td>98</td>
              <td>$2,548</td>
              <td>4.5</td>
            </tr>
            <tr>
              <td>Summer Breeze</td>
              <td>84</td>
              <td>$2,210</td>
              <td>4.3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CommunityContent = () => (
  <div className="section-content">
    <div className="content-header">
      <h2>Reader Community</h2>
      <div className="header-actions">
        <button className="btn-primary">
          <i className='bx bx-message'></i> New Post
        </button>
      </div>
    </div>
    
    <div className="community-feed">
      <div className="post-card">
        <div className="post-header">
          <img src="https://i.pravatar.cc/40?img=5" alt="User" />
          <div className="post-user">
            <strong>Sarah Johnson</strong>
            <span>2 days ago</span>
          </div>
        </div>
        <div className="post-content">
          <p>Just finished reading "The Midnight Tales" - what an amazing journey! The character development was incredible.</p>
        </div>
        <div className="post-actions">
          <button><i className='bx bx-like'></i> Like (24)</button>
          <button><i className='bx bx-comment'></i> Comment (7)</button>
        </div>
      </div>
      
      <div className="post-card">
        <div className="post-header">
          <img src="https://i.pravatar.cc/40?img=8" alt="User" />
          <div className="post-user">
            <strong>Michael Chen</strong>
            <span>4 days ago</span>
          </div>
        </div>
        <div className="post-content">
          <p>Does anyone know when the sequel to "Ocean Dreams" is coming out? I can't wait to read more!</p>
        </div>
        <div className="post-actions">
          <button><i className='bx bx-like'></i> Like (18)</button>
          <button><i className='bx bx-comment'></i> Comment (5)</button>
        </div>
      </div>
    </div>
  </div>
);

const SettingsContent = () => (
  <div className="section-content">
    <h2>Settings</h2>
    
    <div className="settings-tabs">
      <button className="tab-active">Account</button>
      <button>Notifications</button>
      <button>Privacy</button>
      <button>Billing</button>
    </div>
    
    <div className="settings-form">
      <div className="form-section">
        <h3>Profile Information</h3>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value="Jane Author" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value="jane.author@example.com" />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea>Author of fantasy and mystery novels. Lover of coffee and rainy days.</textarea>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Profile Picture</h3>
        <div className="avatar-upload">
          <img src="https://i.pravatar.cc/150?img=12" alt="Profile" />
          <div className="upload-actions">
            <button className="btn-secondary">Change</button>
            <button className="btn-text">Remove</button>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button className="btn-primary">Save Changes</button>
        <button className="btn-text">Cancel</button>
      </div>
    </div>
  </div>
);

// Reusable Components
const StatCard = ({ icon, title, value, change, changePositive }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <i className={icon}></i>
    </div>
    <div className="stat-info">
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
      <p className={`stat-change ${changePositive ? 'positive' : 'negative'}`}>
        {change}
      </p>
    </div>
  </div>
);

const ActivityItem = ({ icon, text, time }) => (
  <li className="activity-item">
    <i className={icon}></i>
    <div className="activity-details">
      <p>{text}</p>
      <span>{time}</span>
    </div>
  </li>
);

const BookRow = ({ title, status, date, readers, rating }) => (
  <tr>
    <td>
      <div className="book-info">
        <div className="book-cover-small"></div>
        <span>{title}</span>
      </div>
    </td>
    <td>
      <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
    </td>
    <td>{date}</td>
    <td>{readers}</td>
    <td>{rating}</td>
    <td>
      <div className="action-buttons">
        <button className="btn-icon">
          <i className='bx bx-edit'></i>
        </button>
        <button className="btn-icon">
          <i className='bx bx-trash'></i>
        </button>
        <button className="btn-icon">
          <i className='bx bx-dots-vertical-rounded'></i>
        </button>
      </div>
    </td>
  </tr>
);

const LibraryBook = ({ title, cover, progress }) => (
  <div className="library-book">
    <div className="book-cover">
      <img src={cover} alt={title} />
      {progress > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
    <h4>{title}</h4>
    {progress === 100 ? (
      <span className="completed-badge">Completed</span>
    ) : progress > 0 ? (
      <span>{progress}% read</span>
    ) : (
      <span>Not started</span>
    )}
  </div>
);

// Navigation components
const NavItem = ({ title, icon, path, active, onClick, badge }) => (
  <li className={active ? 'active' : ''}>
    <Link to={path} onClick={onClick}>
      <i className={icon}></i>
      <span className="link_name">{title}</span>
      {badge && <span className="badge">{badge}</span>}
      <div className="active-indicator"></div>
    </Link>
  </li>
);

const NavItemWithSubMenu = ({ title, icon, subItems, toggleSubMenu, isOpen, active, onClick }) => (
  <li className={`${isOpen ? 'open' : ''} ${active ? 'active' : ''}`}>
    <div 
      className="icon-link" 
      onClick={(e) => {
        e.preventDefault();
        toggleSubMenu();
        onClick();
      }}
      role="button"
      tabIndex="0"
    >
      <div className="menu-content">
        <i className={icon}></i>
        <span className="link_name">{title}</span>
      </div>
      <i className={`bx bxs-chevron-down arrow ${isOpen ? 'rotated' : ''}`}></i>
      <div className="active-indicator"></div>
    </div>
    <ul className={`sub-menu ${isOpen ? 'open' : ''}`}>
      {subItems.map((subItem, index) => (
        <li key={index}>
          <Link 
            to={subItem.path} 
            className={location.pathname === subItem.path ? 'active' : ''}
          >
            {subItem.name}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);

export default Sidebar;