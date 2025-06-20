import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style/sideBar.scss';

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
  
  export default AnalyticsContent ;