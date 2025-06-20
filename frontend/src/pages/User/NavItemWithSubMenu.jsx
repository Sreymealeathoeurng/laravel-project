import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import './style/sideBar.scss';
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
  
  export default NavItemWithSubMenu ;