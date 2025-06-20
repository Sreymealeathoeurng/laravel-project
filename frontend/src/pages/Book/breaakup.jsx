const handleSaveBook = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/library/save', {
        book_id: id,
        status: 'saved_later'  // matches backend validation now
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setIsSaved(true);
      setSuccessMessage('📚 Book saved to your library!');
      setError(null);
  
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to save book.');
    } finally {
      setSaving(false);
    }
  };