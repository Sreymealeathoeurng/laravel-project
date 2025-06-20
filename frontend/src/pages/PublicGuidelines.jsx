import React from 'react';
import { Helmet } from 'react-helmet';
import { FaBook, FaPenAlt, FaUsers, FaBalanceScale, FaExclamationTriangle } from 'react-icons/fa';
import '../assets/styling/Guidelines.scss';

const PublicGuidelines = () => {
  return (
    <div className="guidelines-container">
      <Helmet>
        <title>Community Guidelines | StoryForge</title>
        <meta name="description" content="Read our community guidelines to understand the rules and best practices for publishing and interacting on our platform." />
      </Helmet>

      <header className="guidelines-header">
        <h1><FaBook /> StoryForge Community Guidelines</h1>
        <p className="subtitle">Helping create a positive environment for writers and readers</p>
        <div className="last-updated">Last updated: {new Date().toLocaleDateString()}</div>
      </header>

      <div className="guidelines-content">
        <section className="guidelines-section">
          <h2><FaPenAlt /> Content Publishing Rules</h2>
          <div className="guideline-card">
            <h3>Original Work</h3>
            <p>All content must be your original creation. Plagiarism will result in immediate removal and may lead to account suspension.</p>
          </div>
          <div className="guideline-card">
            <h3>Genre Appropriateness</h3>
            <p>Tag your work with the correct genre(s). Misleading tags affect reader experience and may result in reclassification.</p>
          </div>
          <div className="guideline-card warning">
            <h3><FaExclamationTriangle /> Prohibited Content</h3>
            <ul>
              <li>Hate speech or discriminatory content</li>
              <li>Explicit content without proper warnings</li>
              <li>Illegal activities or instructions</li>
              <li>Spam or promotional content</li>
            </ul>
          </div>
        </section>

        <section className="guidelines-section">
          <h2><FaUsers /> Community Interaction</h2>
          <div className="guideline-card">
            <h3>Constructive Feedback</h3>
            <p>When commenting on others' work, focus on constructive criticism. Personal attacks will not be tolerated.</p>
          </div>
          <div className="guideline-card">
            <h3>Collaboration Etiquette</h3>
            <p>Respect your co-authors and collaborators. Clearly define roles and expectations for shared projects.</p>
          </div>
          <div className="guideline-card">
            <h3>Beta Reading</h3>
            <p>When participating in beta reading exchanges, honor your commitments and provide timely feedback.</p>
          </div>
        </section>

        <section className="guidelines-section">
          <h2><FaBalanceScale /> Copyright & Legal</h2>
          <div className="guideline-card">
            <h3>Intellectual Property</h3>
            <p>You retain all rights to your original work. By publishing, you grant StoryForge a non-exclusive license to display your content.</p>
          </div>
          <div className="guideline-card">
            <h3>Fan Fiction</h3>
            <p>Fan fiction must comply with the original creator's guidelines and be properly tagged as derivative work.</p>
          </div>
          <div className="guideline-card">
            <h3>DMCA Compliance</h3>
            <p>We respond promptly to valid DMCA takedown notices. Submit claims to our legal team.</p>
          </div>
        </section>

        <section className="guidelines-section">
          <h2>Genre-Specific Guidelines</h2>
          <div className="genre-guidelines">
            <div className="genre-rule">
              <h4>Romance</h4>
              <ul>
                <li>Clearly tag mature content</li>
                <li>Specify subgenres (contemporary, historical, etc.)</li>
                <li>Warn for sensitive themes</li>
              </ul>
            </div>
            <div className="genre-rule">
              <h4>Fantasy/Sci-Fi</h4>
              <ul>
                <li>Provide content warnings for graphic violence</li>
                <li>Include worldbuilding notes where helpful</li>
                <li>Tag magic systems/tech levels appropriately</li>
              </ul>
            </div>
            <div className="genre-rule">
              <h4>Mystery/Thriller</h4>
              <ul>
                <li>Mark spoilers in discussions</li>
                <li>Warn for graphic crime scenes</li>
                <li>Tag plot twists carefully</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="guidelines-footer">
          <h3>Need Help or Have Questions?</h3>
          <p>Contact our moderation team at <a href="mailto:moderation@storyforge.com">moderation@storyforge.com</a> for clarification on any guidelines.</p>
          <p>By using StoryForge, you agree to abide by these community guidelines. We reserve the right to remove content or suspend accounts that violate these rules.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicGuidelines;