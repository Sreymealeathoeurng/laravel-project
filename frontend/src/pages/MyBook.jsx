import React, { useState } from 'react';
import '../assets/styling/MyBook.scss';
import { FaPlus, FaPenAlt, FaTrash, FaUpload } from 'react-icons/fa';

const MyBook = () => {
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Novel', status: 'draft', chapters: 3 },
    { id: 2, title: 'Adventure Tales', status: 'published', chapters: 12 }
  ]);

  const handleCreateBook = () => {
    const newBook = {
      id: books.length + 1,
      title: `New Book ${books.length + 1}`,
      status: 'draft',
      chapters: 0
    };
    setBooks([...books, newBook]);
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handlePublishBook = (id) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, status: 'published' } : book
    ));
  };

  return (
    <div className='my-book-container'>
      <section className='book-session'>
        <div className="top-title-book">
          <h1>My Books</h1>

          <button type="button" className="button" onClick={handleCreateBook}>
            <span className="button__text">Add Item</span>
            <span className="button__icon">
              <FaPlus />
            </span>
          </button>
        </div>
        <div className="display-Mybook">
          <div className="myBook_header">
          <h2>All Books</h2>
          </div>


           
          <div className="books-grid">
              {books.map(book => (
                  <div key={book.id} className="book-card">
                    <div className="book-card-contant">
                    <div className={`book-status ${book.status}`}>
                          {book.status.toUpperCase()}
                      </div>
                      <h3 className="book-title">{book.title || "Untitled Story"}</h3>
                      <p className="chapter-count">{book.chapters} chapters</p>
                      <p className="update-info">Updated Apr 18, 2025 11:18AM</p>
                      <div className="book-actions">
                          <button className="continue-btn">
                              Continue Writing
                          </button>
                          <div className="action-icons">
                              <button className="edit-btn">
                                  <FaPenAlt />
                              </button>
                              {book.status === 'draft' && (
                                  <button className="publish-btn" onClick={() => handlePublishBook(book.id)}>
                                      <FaUpload />
                                  </button>
                              )}
                              <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>
                                  <FaTrash />
                              </button>
                          </div>
                      </div>

                    </div>
                     
                  </div>
              ))}
          </div>
</div>
       
      </section>
    </div>
  );
};

export default MyBook;