import React, { useState } from 'react';
import axios from 'axios';

const SubmitReview = ({ bookingId, serviceId }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post('/api/reviews/store', {
        booking_id: bookingId,
        comment,
        rating,
        service_id: serviceId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('✅ Your rating has been submitted!');
      setComment('');
      setRating(5);
    } catch (error) {
      console.error('Review submission failed:', error);
      setMessage('❌ Failed to submit rating.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4 style={styles.heading}>Submit Your Rating</h4>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        style={styles.textarea}
      />

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={styles.select}
      >
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
        ))}
      </select>

      <button type="submit" style={styles.button}>
        ⭐ Submit Rating
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
};

const styles = {
  form: {
    marginTop: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    minHeight: '60px',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    display: 'block',
    marginBottom: '10px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#ffca28',
    color: '#000',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  message: {
    marginTop: '10px',
    fontStyle: 'italic',
  }
};

export default SubmitReview;
