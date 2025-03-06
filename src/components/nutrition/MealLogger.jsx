import { useState, useEffect, useRef } from 'react';
import { useNutrition } from '../../context/NutritionContext';
import { initSpeechRecognition, processNutritionText } from '../../services/geminiApi';

const MealLogger = () => {
  const { addMeal, meals } = useNutrition();
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const [isListening, setIsListening] = useState(false);
  const [todayMeals, setTodayMeals] = useState([]);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const micButtonRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    const recognition = initSpeechRecognition();
    setSpeechRecognition(recognition);
  }, []);
  
  // Filter today's meals
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const filtered = meals.filter(meal => 
      meal.created_at && meal.created_at.startsWith(today)
    );
    
    setTodayMeals(filtered);
  }, [meals]);
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newMeal.name || !newMeal.calories) {
      return;
    }
    
    try {
      // Convert string values to numbers
      const mealData = {
        name: newMeal.name,
        calories: Number(newMeal.calories),
        protein: Number(newMeal.protein) || 0,
        carbs: Number(newMeal.carbs) || 0,
        fats: Number(newMeal.fats) || 0
      };
      
      await addMeal(mealData);
      
      // Reset form
      setNewMeal({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };
  
  // Start voice recognition
  const startListening = () => {
    if (!speechRecognition) return;
    
    setIsListening(true);
    setRecognizedText('');
    
    speechRecognition.onResult((text) => {
      setRecognizedText(text);
    });
    
    speechRecognition.onError((error) => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    });
    
    speechRecognition.start();
  };
  
  // Stop voice recognition and process text
  const stopListening = async () => {
    if (!speechRecognition) return;
    
    speechRecognition.stop();
    setIsListening(false);
    
    if (recognizedText) {
      setProcessing(true);
      
      try {
        // Process the text to extract nutrition information
        const nutritionData = await processNutritionText(recognizedText);
        
        if (nutritionData) {
          // Update form with extracted data
          setNewMeal({
            name: nutritionData.foodItem,
            calories: nutritionData.calories.toString(),
            protein: nutritionData.protein.toString(),
            carbs: nutritionData.carbs.toString(),
            fats: nutritionData.fats.toString()
          });
        }
      } catch (error) {
        console.error('Error processing nutrition text:', error);
      } finally {
        setProcessing(false);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-green-500 p-4 text-white">
        <h2 className="text-xl font-semibold">Log Your Meals</h2>
        <p className="text-sm text-green-100">Track your nutrition intake</p>
      </div>
      
      {/* Voice Input Section */}
      <div className="p-4 bg-green-50 border-b border-green-100">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Voice Food Logging</h3>
            <p className="text-sm text-gray-600">Describe what you ate</p>
          </div>
          <button
            ref={micButtonRef}
            onClick={isListening ? stopListening : startListening}
            disabled={processing}
            className={`ml-auto p-3 rounded-full ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Voice Status */}
        {isListening && (
          <div className="text-sm text-green-700 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Listening... Describe what you ate
          </div>
        )}
        
        {processing && (
          <div className="text-sm text-blue-600 flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing your food...
          </div>
        )}
        
        {recognizedText && !isListening && !processing && (
          <div className="text-sm text-gray-700 mt-2">
            <p className="font-medium">Recognized:</p>
            <p className="italic">{recognizedText}</p>
          </div>
        )}
      </div>
      
      {/* Manual Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newMeal.name}
              onChange={handleInputChange}
              placeholder="e.g. Chicken Salad"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={newMeal.calories}
              onChange={handleInputChange}
              placeholder="e.g. 500"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={newMeal.protein}
              onChange={handleInputChange}
              placeholder="e.g. 30"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={newMeal.carbs}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="fats" className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
            <input
              type="number"
              id="fats"
              name="fats"
              value={newMeal.fats}
              onChange={handleInputChange}
              placeholder="e.g. 15"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded transition"
        >
          Log This Meal
        </button>
      </form>
      
      {/* Today's Meals List */}
      <div className="p-4 border-t">
        <h3 className="font-medium mb-2">Today's Meals ({todayMeals.length})</h3>
        
        {todayMeals.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No meals logged yet today</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {todayMeals.map((meal, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{meal.name}</h4>
                  <span className="text-green-600 font-bold">{meal.calories} cal</span>
                </div>
                <div className="text-sm text-gray-600 flex space-x-4">
                  <span>Protein: {meal.protein}g</span>
                  <span>Carbs: {meal.carbs}g</span>
                  <span>Fats: {meal.fats}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealLogger; 