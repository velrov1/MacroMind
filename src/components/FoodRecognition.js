import React, { useState, useEffect } from 'react';
import GeminiService from '../services/geminiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faDrumstickBite, faBreadSlice, faOilCan } from '@fortawesome/free-solid-svg-icons';

const FoodRecognition = ({ imageData }) => {
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recognizeFood = async () => {
    setLoading(true);
    setError(null);
    setNutritionInfo(null);
    
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const geminiService = new GeminiService(apiKey);
      const nutritionData = await geminiService.analyzeImage(imageData);
      setNutritionInfo(nutritionData);
    } catch (err) {
      setError('Error recognizing food. Please try again.');
      console.error('Recognition error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageData) {
      recognizeFood();
    }

    return () => {
      setNutritionInfo(null);
      setError(null);
      setLoading(false);
    };
  }, [imageData]);

  if (loading) {
    return <div>Analyzing image...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="nutrition-info">
      {nutritionInfo && (
        <div>
          <h2 className="food-name">{nutritionInfo.foodName}</h2>
          <div className="nutrition-grid">
            <div className="nutrition-card calories">
              <div className="card-icon">
                <FontAwesomeIcon icon={faFire} />
              </div>
              <div className="card-content">
                <span className="card-label">Calories</span>
                <div className="card-value-container">
                  <span className="card-value">{nutritionInfo.calories}</span>
                  <span className="card-unit">kcal</span>
                </div>
              </div>
            </div>
            <div className="nutrition-card protein">
              <div className="card-icon">
                <FontAwesomeIcon icon={faDrumstickBite} />
              </div>
              <div className="card-content">
                <span className="card-label">Protein</span>
                <div className="card-value-container">
                  <span className="card-value">{nutritionInfo.protein}</span>
                </div>
              </div>
            </div>
            <div className="nutrition-card carbs">
              <div className="card-icon">
                <FontAwesomeIcon icon={faBreadSlice} />
              </div>
              <div className="card-content">
                <span className="card-label">Carbs</span>
                <div className="card-value-container">
                  <span className="card-value">{nutritionInfo.carbs}</span>
                </div>
              </div>
            </div>
            <div className="nutrition-card fat">
              <div className="card-icon">
                <FontAwesomeIcon icon={faOilCan} />
              </div>
              <div className="card-content">
                <span className="card-label">Fat</span>
                <div className="card-value-container">
                  <span className="card-value">{nutritionInfo.fat}</span>
                         </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodRecognition;