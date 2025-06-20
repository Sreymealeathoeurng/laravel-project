import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import './style/sideBar.scss';

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
  
  export default  NavItem;