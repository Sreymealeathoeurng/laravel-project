import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './style/sideBar.scss';
const CommunityContent = () => (
    <div className="community-content">
      <div className="community-content__header">
        <h2>Reader Community</h2>
        <div className="header-actions">
          <button className="btn-primary">
            <i className='bx bx-message'></i> New Post
          </button>
        </div>
      </div>
      
      <div className="community-content__feed">
        <div className="post-card">
          <div className="post-card__header">
            <img 
              src="https://i.pravatar.cc/40?img=5" 
              alt="User" 
              className="post-card__avatar"
            />
            <div className="post-card__user">
              <strong>Sarah Johnson</strong>
              <span>2 days ago</span>
            </div>
          </div>
          <div className="post-card__content">
            <p>Just finished reading "The Midnight Tales" - what an amazing journey! The character development was incredible.</p>
          </div>
          <div className="post-card__actions">
            <button><i className='bx bx-like'></i> Like (24)</button>
            <button><i className='bx bx-comment'></i> Comment (7)</button>
          </div>
        </div>
        
        <div className="post-card">
          <div className="post-card__header">
            <img 
              src="https://i.pravatar.cc/40?img=8" 
              alt="User" 
              className="post-card__avatar"
            />
            <div className="post-card__user">
              <strong>Michael Chen</strong>
              <span>4 days ago</span>
            </div>
          </div>
          <div className="post-card__content">
            <p>Does anyone know when the sequel to "Ocean Dreams" is coming out? I can't wait to read more!</p>
          </div>
          <div className="post-card__actions">
            <button><i className='bx bx-like'></i> Like (18)</button>
            <button><i className='bx bx-comment'></i> Comment (5)</button>
          </div>
        </div>
      </div>
    </div>
  );
  export default CommunityContent;