import { useState, useEffect } from 'react';
import '../assets/styling/ChapterForm.scss';

const ChapterForm = () => {
  const initialFormData = {
    bookTitle: '',
    chapterNumber: 1,
    chapterTitle: '',
    chapterContent: '',
    chapterStatus: 'draft',
    writingDate: new Date().toISOString().split('T')[0],
    containsImages: false,
    containsDialogue: false,
    containsFlashback: false,
    chapterSummary: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const count = formData.chapterContent.trim() === ''
      ? 0
      : formData.chapterContent.trim().split(/\s+/).length;
    setWordCount(count);
  }, [formData.chapterContent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, wordCount });
    alert('Chapter saved successfully!');
    setFormData(initialFormData); // Reset form after submission
  };

  return (
    <div className="container">
      <h1 className="title">Book Chapter Input Form</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="formSection">
          <h2>Chapter Identification</h2>
          
          <div className="formGroup">
            <label htmlFor="bookTitle">Book Title:</label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="chapterNumber">Chapter Number:</label>
            <input
              type="number"
              id="chapterNumber"
              name="chapterNumber"
              min="1"
              value={formData.chapterNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="chapterTitle">Chapter Title:</label>
            <input
              type="text"
              id="chapterTitle"
              name="chapterTitle"
              value={formData.chapterTitle}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="formSection">
          <h2>Chapter Content</h2>
          
          <div className="formGroup">
            <label htmlFor="chapterContent">Chapter Text:</label>
            <textarea
              id="chapterContent"
              name="chapterContent"
              value={formData.chapterContent}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="wordCount">Word Count:</label>
            <input
              type="number"
              id="wordCount"
              name="wordCount"
              value={wordCount}
              readOnly
            />
          </div>
        </div>
        
        <div className="formSection">
          <h2>Chapter Metadata</h2>
          
          <div className="formGroup">
            <label htmlFor="chapterStatus">Chapter Status:</label>
            <select
              id="chapterStatus"
              name="chapterStatus"
              value={formData.chapterStatus}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="edited">Edited</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div className="formGroup">
            <label htmlFor="writingDate">Date Written:</label>
            <input
              type="date"
              id="writingDate"
              name="writingDate"
              value={formData.writingDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="formGroup">
            <label>Chapter Features:</label>
            <div className="checkboxGroup">
              <input
                type="checkbox"
                id="containsImages"
                name="containsImages"
                checked={formData.containsImages}
                onChange={handleChange}
              />
              <label htmlFor="containsImages">Contains images/illustrations</label>
            </div>
            <div className="checkboxGroup">
              <input
                type="checkbox"
                id="containsDialogue"
                name="containsDialogue"
                checked={formData.containsDialogue}
                onChange={handleChange}
              />
              <label htmlFor="containsDialogue">Contains significant dialogue</label>
            </div>
            <div className="checkboxGroup">
              <input
                type="checkbox"
                id="containsFlashback"
                name="containsFlashback"
                checked={formData.containsFlashback}
                onChange={handleChange}
              />
              <label htmlFor="containsFlashback">Contains flashback</label>
            </div>
          </div>
          
          <div className="formGroup">
            <label htmlFor="chapterSummary">Brief Summary (for outline):</label>
            <textarea
              id="chapterSummary"
              name="chapterSummary"
              value={formData.chapterSummary}
              onChange={handleChange}
              rows="4"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="notes">Author Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any notes about this chapter..."
            />
          </div>
        </div>
        
        <button type="submit" className="submitButton">Save Chapter</button>
      </form>
    </div>
  );
};

export default ChapterForm;