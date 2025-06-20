import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/CustomCarousel';
import '../assets/styling/home.scss';
import ScrollAnimation from './ScrollAnimation';
import Footer from './Footer';
import pic6 from '../assets/images/img.png';
import pic3 from '../assets/images/intro3.png';
import pic5 from '../assets/images/novel.png';
import Logo from '../assets/images/logo.png';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleNavigation = (path) => navigate(path);

  const menuItems = {
    BrowseBooks: [
      { name: 'Genres', path: '/genres' },
       /* { name: 'New Releases', path: '/new-releases' },
      { name: 'Recommended Reads', path: '/recommended' },*/
      { isDivider: true },
        /*{ name: 'Book Clubs', path: '/book-clubs' },  */
    ],
    writingPub: [
      { name: 'My Library', path: '/dashboard/library' },
      { name: 'Public Guidelines', path: '/guidelines' },
      { isDivider: true },
      { name: 'Settings', path: '/settings' },
      
    /*   { name: 'Start Writing', path: '/create-story' },
     { name: 'Manage My Book', path: '/manage-books' },*/
    ],
     /* myBook: [

      { name: 'Edit Book', path: '/edit-book' },  
    
    ], 
  community: [
      { name: 'Discussion Forums', path: '/forums' },
      { name: 'Book Recommendations', path: '/recommendations' },
      { isDivider: true },
      { name: 'Author Q&A Sessions', path: '/qa' },
    ],
  */
  };

  const DropdownMenu = ({ items, dropdownId }) => (
    <ul className="dropdown-menu" aria-labelledby={dropdownId}>
      {items.map((item, index) =>
        item.isDivider ? (
          <li key={`divider-${index}`}>
            <hr className="dropdown-divider" />
          </li>
        ) : (
          <li key={item.path}>
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.path);
              }}
            >
              {item.name}
            </a>
          </li>
        )
      )}
    </ul>
  );

  return (
    <>
      <header>
        <nav className="menu d-flex justify-content-between align-items-center p-2">
          <div className="left-items d-flex align-items-center gap-2">
            <div className="logo">
              <img src={Logo} alt="Company Logo" />
            </div>
            {Object.keys(menuItems).map((key, idx) => {
              const dropdownId = `dropdownMenuButton-${idx}`;
              return (
                <div className="btn-group" key={key}>
                  <button
                    type="button"
                    className="btn btn-danger dropdown-toggle"
                    id={dropdownId}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                  <DropdownMenu items={menuItems[key]} dropdownId={dropdownId} />
                </div>
              );
            })}
          </div>

          {/* AUTHENTICATION STATE UI */}
        {/* AUTHENTICATION STATE UI */}
{user ? (
  <div className="dropdown user-profile-dropdown">
    <button
      className="btn btn-secondary dropdown-toggle d-flex align-items-center"
      type="button"
      id="userDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <img
        src="https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_1280.png"
        alt="User"
        className="rounded-circle"
        style={{ width: '40px', height: '40px', marginRight: '8px' }}
      />
      {user.name || 'Profile'}
    </button>
    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
      {/* Display options based on user role */}
      {user.role === 'reader' ? (
        <>
          <li>
            <a
              href="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/dashboard/library'); // Navigate to My Library
              }}
            >
              My Library
            </a>
          </li>
          <li>
            <a
              href="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/dashboard/settings'); // Navigate to Settings
              }}
            >
              Settings
            </a>
          </li>
        </>
      ) : user.role === 'author' ? (
        <>
          <li>
            <a
              href="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/profile'); // Navigate to Profile
              }}
            >
              Account Info
            </a>
          </li>
         
          <li>
            <a
              href="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/settings'); // Navigate to Settings
              }}
            >
              Settings
            </a>
          </li>
        </>
      ) : null}
      <li>
        <hr className="dropdown-divider" />
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item text-danger"
          onClick={handleLogout}
        >
          Log out
        </button>
      </li>
    </ul>
  </div>
) : (
  <div className="login-btn d-flex gap-2">
    <button aria-label="Login" onClick={() => handleNavigation('/login')}>
      <span className="box1">Login</span>
    </button>
    <button aria-label="Sign up" onClick={() => handleNavigation('/signup')}>
      <span className="box">Sign up</span>
    </button>
  </div>
)}
        </nav>
      </header>

      <div className="home">
        <main>
          <section className="welcome-contact">
            <Carousel />
          </section>

          <div className="intro-contact">
            <h1 className="intro-heading">
              Quick access to all our features ensures a seamless experience as you embark on your writing journey.
            </h1>
            <div className="contact">
              <ScrollAnimation delay={0}>
                <article className="block1">
                  <div className="images">
                    <img src={pic6} alt="Explore Categories" />
                  </div>
                  <div className="contact">
                    <h4>Explore Categories</h4>
                    <p>
                      Browse through a wide variety of book categories that cater to every genre.
                      Whether you're a fan of fiction, non-fiction, mystery, romance, or fantasy,
                      there's something for everyone.
                    </p>
                  </div>
                </article>
              </ScrollAnimation>

              <ScrollAnimation delay={300}>
                <article className="block2">
                  <div className="contact">
                    <h4>Start Your Writing</h4>
                    <p>
                      Dive into the creative process with our intuitive writing dashboard.
                      Whether you're drafting your first chapter or polishing a manuscript,
                      we provide the tools you need to succeed.
                    </p>
                  </div>
                  <div className="images">
                    <img src={pic5} alt="Start Your Writing" />
                  </div>
                </article>
              </ScrollAnimation>

              <ScrollAnimation delay={600}>
                <article className="block3">
                  <div className="images">
                    <img src={pic3} alt="Manage Publications" />
                  </div>
                  <div className="contact">
                    <h4>Manage Your Publications</h4>
                    <p>
                      Keep track of your authored books and manage your publications effortlessly.
                      Our user-friendly interface allows you to create, update, edit, and publish
                      your work with just a few clicks.
                    </p>
                  </div>
                </article>
              </ScrollAnimation>
            </div>
          </div>

          <footer className="bg-body-tertiary text-center">
            <Footer />
          </footer>
        </main>
      </div>
    </>
  );
};

export default Home;
