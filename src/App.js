import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import FoodRecognition from './components/FoodRecognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <ImageUpload onImageCapture={handleImageCapture} />
            {capturedImage && <FoodRecognition imageData={capturedImage} />}
          </>
        );
      case 'about':
        return (
          <div className="about-section">
            <h2>About MacroMind</h2>
            <p>Welcome to MacroMind - Your Smart Food Calorie Tracker!</p>
            <p>MacroMind uses advanced AI technology to help you track your food intake and maintain a healthy lifestyle. Simply take a photo of your food or upload an existing image, and our AI will analyze it to provide you with detailed nutritional information.</p>
            <div className="features">
              <h3>Key Features:</h3>
              <ul>
                <li>Instant food recognition</li>
                <li>Accurate calorie counting</li>
                <li>Detailed nutritional breakdown</li>
                <li>Easy-to-use interface</li>
                <li>Camera and image upload support</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="App-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="text-3xl font-bold text-primary animate-fade-in">MacroMind</h1>
            <p className="text-sm text-gray-600 animate-slide-up">Smart Nutrition Tracker</p>
          </div>
          <button
            className="theme-toggle-button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>
      </header>
      <div className="App-main">
        <div className="container mx-auto px-4">
          {renderContent()}
        </div>
      </div>
      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://instagram.com/velrov" target="_blank" rel="noopener noreferrer" className="footer-link">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="mailto:velyup@gmail.com" className="footer-link">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
          <div className="footer-signature">
            Made with <span>❤️</span> by velrov
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;