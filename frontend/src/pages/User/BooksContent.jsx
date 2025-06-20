import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/BookContent.scss';

const BooksContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState('grid');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    readers: 1245,
    avgRating: 4.6,
    earnings: 2845
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/books', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBooks(res.data);
        setStats(prev => ({ ...prev, totalBooks: res.data.length }));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    const title = (book.title || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase());
    const status = book.is_published ? 'Published' : 'Draft';
    const matchesStatus = statusFilter === 'All Status' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBooks(books.filter(book => book.id !== bookToDelete));
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return '#27ae60';
      case 'Draft': return '#f39c12';
      default: return '#6c5ce7';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRandomCoverColor = () => {
    const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="author-dashboard">
      {showDeleteModal && (
        <div className="delete-modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this book?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="welcome-banner">
        <div className="welcome-text">
          <p>Manage your literary works and track performance</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/create-story')}>
            <i className='bx bx-plus'></i> Start New Book
          </button>
          <div className="search-filter">
            <div className="search-box">
              <i className='bx bx-search'></i>
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="bx bx-book" title="Total Books" value={stats.totalBooks} change="+3 this month" changePositive />
      
      </div>

      <div className="content-header">
        <h2>Your Books Collection</h2>
        <div className="view-options">
          <button className={`view-option ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <i className='bx bx-grid'></i> Grid
          </button>
          <button className={`view-option ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <i className='bx bx-list-ul'></i> List
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="books-grid">
          {loading ? (
            <div className="loading-container"><div className="spinner"></div><p>Loading your books...</p></div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => navigate(`/edit-book/${book.id}`)}
                onDelete={() => handleDelete(book.id)}
                onView={() => navigate(`/books/${book.id}/preview`)}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                getRandomCoverColor={getRandomCoverColor}
              />
            ))
          ) : (
            <div className="empty-state">
              <i className='bx bx-book-open'></i>
              <h3>No books found</h3>
              <p>Try changing your search or filter criteria</p>
              <button className="btn-primary" onClick={() => navigate('/create-story')}>Create Your First Book</button>
            </div>
          )}
        </div>
      ) : (
        <div className="books-table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th className="title-col">Title</th>
                <th className="status-col">Status</th>
                <th className="date-col">Date</th>
                <th className="readers-col">Readers</th>
                <th className="rating-col">Rating</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading-row">Loading books...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className="error-row">{error}</td></tr>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <BookRow
                    key={book.id}
                    book={book}
                    onEdit={() => navigate(`/edit-book/${book.id}`)}
                    onDelete={() => handleDelete(book.id)}
                    onView={() => navigate(`/books/${book.id}/preview`)}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <tr><td colSpan="6" className="empty-row">No books match your criteria</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, change, changePositive }) => (
  <div className="stat-card">
    <div className="stat-icon"><i className={icon}></i></div>
    <div className="stat-info">
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
      <p className={`stat-change ${changePositive ? 'positive' : 'negative'}`}>
        <i className={`bx bx-${changePositive ? 'up-arrow' : 'down-arrow'}`}></i>
        {change}
      </p>
    </div>
  </div>
);

const BookRow = ({ book, onEdit, onDelete, onView, getStatusColor, formatDate }) => {
  const title = book.title || 'Untitled';
  const status = book.is_published ? 'Published' : 'Draft';
  const date = book.publication_date ? formatDate(book.publication_date) : '-';
  const readers = book.readers?.toLocaleString() ?? '-';
  const rating = book.rating ?? '-';

  return (
    <tr>
      <td className="title-col">
        <div className="book-info" onClick={onView}>
          {book.coverImage ? (
            <img src={book.coverImage} alt={title} className="cover-image-small" />
          ) : (
            <div className="cover-initial-small" style={{ backgroundColor: book.coverColor || '#6c5ce7' }}>
              {title.charAt(0)}
            </div>
          )}
          <div>
            <span className="book-title">{title}</span>
            <span className="book-id">ID: {book.id}</span>
          </div>
        </div>
      </td>
      <td className="status-col"><span className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>{status}</span></td>
      <td className="date-col">{date}</td>
      <td className="readers-col">{readers}</td>
      <td className="rating-col">{rating !== '-' ? <><i className='bx bxs-star'></i> {rating}</> : '-'}</td>
      <td className="actions-col">
        <div className="action-buttons">
          <button className="btn-icon" onClick={onView}><i className='bx bx-show'></i></button>
          <button className="btn-icon" onClick={onEdit}><i className='bx bx-edit'></i></button>
          <button className="btn-icon" onClick={onDelete}><i className='bx bx-trash'></i></button>
        </div>
      </td>
    </tr>
  );
};

const BookCard = ({ book, onEdit, onDelete, onView, getStatusColor, formatDate, getRandomCoverColor }) => {
  const title = book.title || 'Untitled';
  const status = book.is_published ? 'Published' : 'Draft';
  const date = book.publication_date ? formatDate(book.publication_date) : '-';
  const readers = book.readers?.toLocaleString() ?? '-';
  const rating = book.rating ?? '-';
  const description = book.description || 'No description available';

  return (
    <div className="book-card">
      <div className="book-card-cover" onClick={onView}>
        {book.coverImage ? (
          <img src={book.coverImage} alt={title} className="cover-image" />
        ) : (
          <div className="cover-initial" style={{ backgroundColor: book.coverColor || getRandomCoverColor() }}>
            {title.charAt(0)}
          </div>
        )}
      </div>
      <div className="book-card-content">
        <div className="book-card-header">
          <h3 className="book-card-title" onClick={onView}>{title}</h3>
          <span className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>{status}</span>
        </div>
        <p className="book-card-description">{description.substring(0, 100)}{description.length > 100 ? '...' : ''}</p>
        <div className="book-card-meta">
          <div className="meta-item"><i className='bx bx-calendar'></i><span>{date}</span></div>
          <div className="meta-item"><i className='bx bx-user'></i><span>{readers} readers</span></div>
          {rating !== '-' && <div className="meta-item"><i className='bx bx-star'></i><span>{rating}/5</span></div>}
        </div>
        <div className="book-card-actions">
          <button className="btn-icon" onClick={onView}><i className='bx bx-show'></i></button>
          <button className="btn-icon" onClick={onEdit}><i className='bx bx-edit'></i></button>
          <button className="btn-icon" onClick={onDelete}><i className='bx bx-trash'></i></button>
        </div>
      </div>
    </div>
  );
};

export default BooksContent;
