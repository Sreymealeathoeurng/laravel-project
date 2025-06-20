import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';


// Pages
import Home from './pages/home';
import Genres from './pages/Genres';
import RoleSelection from './pages/choseForm';
import StartWriting from './pages/Book/startWriting';
import StoryBookEditor from './pages/Book/StoryBookEditor';
import ReaderView from './pages/Book/ReaderView';
import ChapterForm from './pages/ChapterForm';
import AuthForm from './pages/AuthForm';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import ReaderDashboard from './pages/ReaderDashboard';
import UserDashboard from './pages/User/UserDashboard';
import BooksContent from './pages/User/BooksContent';
import CommunityContent from './pages/User/CommunityContent';
import SettingsContent from './pages/User/SettingsContent';
import MyLibrary from './pages/User/LibraryContent';
import BookPage from './pages/Book/BookPage';
import EditBook from './pages/Book/EditBook';
import PublicGuidelines from'./pages/PublicGuidelines';

import NotFound from './pages/NotFound';

// Components
import WriterDashboard from './components/WriterDashboard';

function App() {
  return (
    <GoogleOAuthProvider clientId="1002587769616-7gjuncokkortl9uesqkurkpk64spf0ei.apps.googleusercontent.com">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/books" element={<BooksContent />} />
        <Route path="/dashboard/library" element={<MyLibrary />} />
        <Route path="/guidelines" element={<PublicGuidelines />} />

        <Route path="/dashboard/community" element={<CommunityContent />} />
        <Route path="/dashboard/settings" element={<SettingsContent />} />
        <Route path="/profile" element={<UserDashboard />} />
        <Route path="/login" element={<LoginForm />} />
     
        <Route path="/readerView/:slug" element={<ReaderView />} />

          <Route path="/genres" element={<Genres />} />

        {/* Previously Protected Routes — now Normal Routes */}
        <Route path="/reader-dashboard" element={<ReaderDashboard />} />
        <Route path="/writer-dashboard" element={<WriterDashboard />} />
        <Route path="/create-story" element={<StartWriting />} />
        <Route path="/text-editor" element={<StoryBookEditor />} />
        <Route path="/chapter-form" element={<ChapterForm />} />

        {/* Shared User Route */}
        <Route path="/books" element={<BooksContent />} />
        <Route path="/books/:id/preview" element={<BookPage />} />
        <Route path="/edit-book/:id" element={<EditBook />} />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </GoogleOAuthProvider>

  );
}

export default App;
