import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style/Setting.scss';

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_1280.png';

const SettingsContent = () => {
  const [userData, setUserData] = useState({ name: '', email: '', bio: '' });
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newsletter: false
  });

  const fileInputRef = useRef(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData({
          name: response.data.name || '',
          email: response.data.email || '',
          bio: response.data.bio || ''
        });
        setAvatar(response.data.profile_image || DEFAULT_AVATAR);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/home';
  };

  // Handle avatar change button click
  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change (upload avatar)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/profile/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setAvatar(response.data.avatar_url);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload avatar');
    }
  };

  // Handle avatar remove
  const handleRemoveClick = async () => {
    if (!window.confirm('Are you sure you want to remove your avatar?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/profile/avatar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvatar(DEFAULT_AVATAR);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove avatar');
    }
  };

  // Handle input changes in profile form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Save updated profile info
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Save new password
  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password');
    }
  };

  // Handle notification preferences change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      alert('Account deleted successfully. Redirecting to home page...');
      window.location.href = '/home';
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  // Handle broken avatar images (fallback to default)
  const handleAvatarError = (e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = DEFAULT_AVATAR;
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading your settings...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your profile and account preferences</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <button 
            className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="icon-user"></i> Profile
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="icon-lock"></i> Security
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="icon-bell"></i> Notifications
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <i className="icon-shield"></i> Privacy
          </button>
          <button 
            className="sidebar-tab logout-btn"
            onClick={handleLogout}
          >
            <i className="icon-logout"></i> Logout
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Profile Information</h2>
                <p>Update your photo and personal details</p>
              </div>

              <div className="avatar-section">
                <div className="avatar-container">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="profile-avatar"
                    onError={handleAvatarError}
                  />
                  <div className="avatar-overlay">
                    <button onClick={handleChangeClick}>
                      <i className="icon-camera"></i>
                    </button>
                  </div>
                </div>
                <div className="avatar-actions">
                  <button className="btn-outline" onClick={handleChangeClick}>
                    Change Photo
                  </button>
                  <button className="btn-text" onClick={handleRemoveClick}>
                    Remove
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={userData.name} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={userData.email} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    name="bio"
                    value={userData.bio} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-actions">
                {isEditing ? (
                  <>
                    <button className="btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button className="btn-outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn-primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Security Settings</h2>
                <p>Manage your password and account security</p>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Enter a new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <div className="password-tips">
                  <h3>Password Requirements</h3>
                  <ul>
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handlePasswordSave}>
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Privacy Settings</h2>
                <p>Control your data and privacy</p>
              </div>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <div className="danger-option">
                  <p>Permanently delete your account and all associated data</p>
                  <button className="btn-danger" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
