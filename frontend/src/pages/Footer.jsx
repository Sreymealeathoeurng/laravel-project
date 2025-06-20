import React from 'react';
import '../assets/styling/Footer.scss';
import {
  FaHeart,
  FaComment,
  FaShareAlt,
  FaBookmark,
  FaUserFriends,
  FaTrophy,
  FaRegLightbulb,
  FaCrown,
  FaBook,
  FaMoon,
  FaFont,
  FaMicrophone,
  FaEdit,
  FaChartLine,
  FaQuestionCircle
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="writing-platform-footer">
      {/* Quick Engagement Bar */}
      <div className="quick-engagement-bar">
        <div className="engagement-group">
          <button className="engagement-btn" aria-label="Like this chapter">
            <FaHeart className="icon" />
            <span className="count">142</span>
          </button>
          <button className="engagement-btn" aria-label="View comments">
            <FaComment className="icon" />
            <span className="count">23</span>
          </button>
        </div>

        <div className="engagement-group">
          <button className="engagement-btn" aria-label="Bookmark this page">
            <FaBookmark className="icon" />
            <span className="tooltip">Save for later</span>
          </button>
          <button className="engagement-btn" aria-label="Share this story">
            <FaShareAlt className="icon" />
            <span className="tooltip">Share with readers</span>
          </button>
          <button className="engagement-btn premium" aria-label="Support author">
            <FaCrown className="icon" />
            <span className="tooltip">Become a patron</span>
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        {/* For Readers */}
        <div className="footer-section">
          <h3><FaBook /> Reading Experience</h3>
          <ul>
            <li><FaMoon /> Dark Mode <span className="badge">Popular</span></li>
            <li><FaFont /> Text Preferences <span className="badge">New</span></li>
            <li><FaMicrophone /> Audio Narration</li>
            <li>Genre-Specific Themes</li>
            <li>Reading Progress Tracker</li>
          </ul>
        </div>

        {/* For Writers */}
        <div className="footer-section">
          <h3><FaEdit /> Author Tools</h3>
          <ul>
            <li><FaChartLine /> Real-Time Analytics <span className="badge">Pro</span></li>
            <li>Chapter-by-Chapter Feedback</li>
            <li>Genre Comparison Metrics</li>
            <li>Reader Demographics</li>
            <li>Engagement Heatmaps</li>
          </ul>
        </div>

        {/* Community */}
        <div className="footer-section">
          <h3><FaUserFriends /> Community</h3>
          <ul>
            <li><FaTrophy /> Genre Writing Challenges <span className="badge">Weekly</span></li>
            <li><FaRegLightbulb /> Writing Sprints</li>
            <li>Critique Partners Matching</li>
            <li>Beta Reader Network</li>
            <li>Genre-Specific Forums</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h3><FaQuestionCircle /> Resources</h3>
          <ul>
            <li>Genre Writing Guides</li>
            <li>Publishing Roadmaps</li>
            <li>Author Success Stories</li>
            <li>Industry Trends</li>
            <li>Writing Tool Directory</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="copyright">
          © {new Date().getFullYear()} StoryForge | Genre-Focused Writing Platform
        </div>
        <div className="legal-links">
          <a href="/terms">Terms of Use</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/copyright">Copyright</a>
          <a href="/community-guidelines">Community Guidelines</a>
        </div>
        <div className="platform-stats">
          <span>75,342 Authors</span>
          <span>1.2M Readers</span>
          <span>50+ Genres</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;