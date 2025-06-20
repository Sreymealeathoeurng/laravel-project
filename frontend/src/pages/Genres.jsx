import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styling/genres.scss';
import Footer from './Footer';
import bm from '../assets/images/bookING.png';  // default book image
import gr from '../assets/images/genres.png';   // genres illustration
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

const BookCard = ({
  book,
  index,
  showFavorite = true,
  onRead,
  onSave,
  onFavorite,
  onReading,
  isFavorite,
  isSaved,
  isReading,
}) => {
  return (
    <div className="card">
      <div className="card-image-container">
        <img
          src={book.image || bm}
          className="card-image"
          alt={`Cover of ${book.title}`}
        />
        {showFavorite && (
          <button
            className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
            onClick={() => onFavorite(book, !isFavorite)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        )}
      </div>
      <div className="card-content">
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <div className="card-actions">
          <button
            className={`read-button ${index % 2 === 0 ? 'available' : 'unavailable'}`}
            onClick={onRead}
          >
            {index % 2 === 0 ? 'Read Now' : 'Join Waitlist'}
          </button>

          {showFavorite && (
            <>
              <button
                className={`save-icon ${isSaved ? 'saved' : ''}`}
                title={isSaved ? 'Saved for later' : 'Save for later'}
                onClick={() => onSave(book, !isSaved)}
                disabled={isSaved}
              >
                {isSaved ? (
                  <span>✔ Saved</span>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                )}
              </button>

              <button
                className={`reading-icon ${isReading ? 'reading' : ''}`}
                title={isReading ? 'Mark as not reading' : 'Mark as currently reading'}
                onClick={() => onReading(book, !isReading)}
              >
                {isReading ? '📖 Reading' : '📘 Mark Reading'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Genres = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());
  const [savedBooks, setSavedBooks] = useState(new Set());
  const [readingBooks, setReadingBooks] = useState(new Set());
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  // Fetch categories with their published books
  useEffect(() => {
    axios
      .get('/api/categories/published-books')
      .then((response) => {
        setCategories(response.data);
        const allBooks = response.data.flatMap((category) => category.books || []);
        setBooks(allBooks);
        setFilteredBooks(allBooks);
      })
      .catch((error) => {
        console.error('Failed to fetch categorized books:', error);
      });
  }, []);

  // Fetch user's saved, favorite & reading books from library
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('/api/library', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const favoriteSet = new Set();
        const savedSet = new Set();
        const readingSet = new Set();

        response.data.forEach((item) => {
          if (item.pivot?.status === 'favorite') favoriteSet.add(item.id);
          if (item.pivot?.status === 'saved') savedSet.add(item.id);
          if (item.pivot?.status === 'reading') readingSet.add(item.id);
        });

        setFavoriteBooks(favoriteSet);
        setSavedBooks(savedSet);
        setReadingBooks(readingSet);
      })
      .catch((error) => {
        console.error('Failed to fetch user library:', error);
      });
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const results = books.filter((book) =>
      `${book.title} ${book.author} ${book.genre || ''}`.toLowerCase().includes(query)
    );
    setFilteredBooks(results);
    setCurrentIndex(0);
  };

  // Pagination: next set of cards
  const nextCards = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(filteredBooks.length / 5));
  };

  // Pagination: previous set of cards
  const prevCards = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + Math.ceil(filteredBooks.length / 5)) % Math.ceil(filteredBooks.length / 5)
    );
  };

  // Update favorite/saved/reading status on backend and local state
  const updateBookLibrary = async (book, status, isAdding) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAlertMessage('Please login to save books.');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    try {
      if (isAdding) {
        // Add or update
        await axios.post(
          '/api/library/save',
          {
            book_id: book.id,
            action: status,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (status === 'favorite') {
          setFavoriteBooks((prev) => new Set(prev).add(book.id));
        } else if (status === 'saved') {
          setSavedBooks((prev) => new Set(prev).add(book.id));
        } else if (status === 'reading') {
          setReadingBooks((prev) => new Set(prev).add(book.id));
        }

        setAlertMessage(
          `Book "${book.title}" ${
            status === 'favorite'
              ? 'added to favorites'
              : status === 'saved'
              ? 'saved for later'
              : 'marked as currently reading'
          }!`
        );
      } else {
        // Remove
        await axios.delete('/api/library/remove', {
          data: { book_id: book.id },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (status === 'favorite') {
          setFavoriteBooks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(book.id);
            return newSet;
          });
        } else if (status === 'saved') {
          setSavedBooks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(book.id);
            return newSet;
          });
        } else if (status === 'reading') {
          setReadingBooks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(book.id);
            return newSet;
          });
        }

        setAlertMessage(
          `Book "${book.title}" removed from ${
            status === 'favorite'
              ? 'favorites'
              : status === 'saved'
              ? 'saved for later'
              : 'currently reading'
          }.`
        );
      }

      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      if (error.response) {
        console.error('Backend error:', error.response.data);
        setAlertMessage(`Error: ${error.response.data.message || 'Could not update'} "${book.title}".`);
      } else if (error.request) {
        console.error('No response:', error.request);
        setAlertMessage(`Error: No response from server for "${book.title}".`);
      } else {
        console.error('Error:', error.message);
        setAlertMessage(`Error: ${error.message}`);
      }
      setTimeout(() => setAlertMessage(''), 3000);
    }
    
  };

  // Handlers for toggling favorite, saved, reading
  const handleAddToFavorites = (book, isAdding) => {
    updateBookLibrary(book, 'favorite', isAdding);
  };

  const handleSaveForLater = (book, isAdding) => {
    updateBookLibrary(book, 'saved', isAdding);
  };

  const handleAddToReading = (book, isAdding) => {
    updateBookLibrary(book, 'reading', isAdding);
  };

  // Slice current page of books for slider (5 books per page)
  const startIndex = currentIndex * 5;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + 5);

  return (
    <><div className='mport-contain'>
            <div className="genres">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="search-icon" aria-label="Search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </div>

        {alertMessage && (
          <div
            className="alert alert-success"
            role="alert"
            style={{ position: 'fixed', top: 70, right: 20, zIndex: 9999 }}
          >
            {alertMessage}
          </div>
        )}

        <div className="col-md">
          <div className="row1">
            <div className="col-md-8">
              <section className="image-card">
                <img src={gr} alt="Genres Illustration" />
                <div className="bs5-grid-row">
                  <span id="welcome-text">
                    Welcome to the World of <span id="fiction-text">Books</span>
                  </span>
                  <p>Explore thrilling adventures, heartwarming romances, and mind-bending mysteries.</p>
                  <p>Your next great read awaits. Start the adventure now!</p>
                </div>
              </section>
            </div>

            <section className="st-title">
              <h2>New Releases</h2>
            </section>
            <div className="new-releases">
              <div className="slider-container">
                <button
                  onClick={prevCards}
                  disabled={filteredBooks.length <= 5}
                  className="nav-button"
                  aria-label="Previous"
                >
                  ❮
                </button>
                <div className="card-container">
                  {currentBooks.length > 0 ? (
                    currentBooks.map((book, index) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        index={index}
                        onRead={() => navigate(`/readerView/${book.slug}`)}
                        onFavorite={handleAddToFavorites}
                        onSave={handleSaveForLater}
                        onReading={handleAddToReading}
                        isFavorite={favoriteBooks.has(book.id)}
                        isSaved={savedBooks.has(book.id)}
                        isReading={readingBooks.has(book.id)}
                      />
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No books found matching your search</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={nextCards}
                  disabled={filteredBooks.length <= 5}
                  className="nav-button"
                  aria-label="Next"
                >
                  ❯
                </button>
              </div>
            </div>

            <section className="st-title">
              <h2>Books by Genre</h2>
            </section>
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="genre-section">
                  <h3 className="genre-name">{category.name}</h3>
                  <div className="card-container">
                    {category.books.map((book, index) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        index={index}
                        onRead={() => navigate(`/readerView/${book.slug}`)}
                        onFavorite={handleAddToFavorites}
                        onSave={handleSaveForLater}
                        onReading={handleAddToReading}
                        isFavorite={favoriteBooks.has(book.id)}
                        isSaved={savedBooks.has(book.id)}
                        isReading={readingBooks.has(book.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No genres found</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

      <Footer />
    </>
  );
};

export default Genres;
