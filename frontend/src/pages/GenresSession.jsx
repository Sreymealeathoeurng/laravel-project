// GenresSession.jsx
import React from 'react';
import Logo from '../assets/images/logo.png';
import '../assets/styling/genres.scss';

const GenresSession = () => {
    return (
        <div className="genres-session">
            <section className="container-fluid">
                <div className="logo1">
                    <img src={Logo} alt="Company Logo" />
                </div>
                <form className="d-flex" style={{ width: '30%', alignItems: 'center' }}>
                    <div className="search-group">
                        <div className="group">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                </g>
                            </svg>
                            <input
                                id="query"
                                className="input"
                                type="search"
                                placeholder="Search..."
                                name="searchbar"
                                aria-label="Search genres"
                            />
                        </div>
                    </div>
                </form>
            </section>

            <nav className="genres-menu">
                <div className="bg-light">
                    <ul>
                        <li><a href="">Fiction</a></li>
                        <li><a href="">Non-Fiction</a></li>
                        <li><a href="">Mystery</a></li>
                        <li><a href="">Science Fiction</a></li>
                        <li><a href="">Fantasy</a></li>
                        <li><a href="">Biography</a></li>
                        <li><a href="">History</a></li>
                        <li><a href="">Self-Help</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default GenresSession;