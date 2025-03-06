import { useEffect, useRef } from 'react';

const TrafficLightGame = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create iframe to contain the game
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Add the iframe to the container
    containerRef.current.appendChild(iframe);
    
    // Get the document inside the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Write the game HTML to the iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Traffic Light Reaction Game</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #222;
                  color: #fff;
                  transition: background-color 0.3s;
              }
              
              .game-container {
                  text-align: center;
                  width: 100%;
                  max-width: 600px;
                  padding: 20px;
              }
              
              h1 {
                  margin-bottom: 30px;
                  color: #f8f8f8;
                  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
              }
              
              #instructions {
                  font-size: 18px;
                  margin-bottom: 30px;
                  line-height: 1.5;
              }
              
              #traffic-light {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin: 20px auto;
                  background-color: #333;
                  padding: 10px;
                  border-radius: 10px;
                  width: 100px;
                  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
              }
              
              .light {
                  width: 80px;
                  height: 80px;
                  border-radius: 50%;
                  margin: 10px;
                  background-color: #555;
                  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
                  transition: background-color 0.3s;
              }
              
              #red-light.active {
                  background-color: #ff0000;
                  box-shadow: 0 0 20px #ff0000, inset 0 0 10px rgba(0, 0, 0, 0.3);
              }
              
              #yellow-light.active {
                  background-color: #ffcc00;
                  box-shadow: 0 0 20px #ffcc00, inset 0 0 10px rgba(0, 0, 0, 0.3);
              }
              
              #green-light.active {
                  background-color: #00cc00;
                  box-shadow: 0 0 20px #00cc00, inset 0 0 10px rgba(0, 0, 0, 0.3);
              }
              
              #reaction-button {
                  width: 200px;
                  height: 200px;
                  border-radius: 50%;
                  border: none;
                  background-color: #e74c3c;
                  color: white;
                  font-size: 24px;
                  font-weight: bold;
                  cursor: pointer;
                  margin: 30px auto;
                  display: block;
                  box-shadow: 0 0 20px rgba(231, 76, 60, 0.7);
                  transition: transform 0.1s, box-shadow 0.1s;
                  outline: none;
              }
              
              #reaction-button:active {
                  transform: scale(0.95);
                  box-shadow: 0 0 10px rgba(231, 76, 60, 0.9);
              }
              
              #result {
                  font-size: 22px;
                  margin: 20px 0;
                  min-height: 60px;
              }
              
              #feedback {
                  font-size: 24px;
                  font-weight: bold;
                  margin: 10px 0;
                  min-height: 30px;
                  color: #3498db;
              }
              
              .early-release {
                  animation: flash-red 0.5s;
              }
              
              @keyframes flash-red {
                  0%, 100% { background-color: #222; }
                  50% { background-color: #e74c3c; }
              }
              
              #start-button {
                  padding: 12px 24px;
                  background-color: #3498db;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  font-size: 18px;
                  cursor: pointer;
                  margin-top: 20px;
                  transition: background-color 0.2s;
              }
              
              #start-button:hover {
                  background-color: #2980b9;
              }
              
              .hidden {
                  display: none !important;
              }
          </style>
      </head>
      <body>
          <div class="game-container">
              <h1>Traffic Light Reaction Game</h1>
              
              <div id="instructions">
                  <p>Press and hold the red button. Watch the traffic light!</p>
                  <p>When the light turns GREEN, release the button as quickly as possible!</p>
                  <p>We'll measure how fast you react and tell you how good your reflexes are.</p>
              </div>
              
              <div id="traffic-light">
                  <div id="red-light" class="light"></div>
                  <div id="yellow-light" class="light"></div>
                  <div id="green-light" class="light"></div>
              </div>
              
              <button id="start-button">Start Game</button>
              
              <div id="game-area" class="hidden">
                  <button id="reaction-button">HOLD ME</button>
                  
                  <div id="result"></div>
                  <div id="feedback"></div>
              </div>
          </div>
          
          <script>
              // Game elements
              const body = document.body;
              const startButton = document.getElementById('start-button');
              const gameArea = document.getElementById('game-area');
              const reactionButton = document.getElementById('reaction-button');
              const resultDisplay = document.getElementById('result');
              const feedbackDisplay = document.getElementById('feedback');
              const redLight = document.getElementById('red-light');
              const yellowLight = document.getElementById('yellow-light');
              const greenLight = document.getElementById('green-light');
              
              // Game state variables
              let isHolding = false;
              let greenLightOn = false;
              let waitingForRelease = false;
              let greenLightTime = 0;
              let buttonPressTime = 0;
              let waitTimer = null;
              let yellowTimer = null;
              let gameActive = false;
              
              // Start the game
              startButton.addEventListener('click', function() {
                  if (gameActive) return;
                  
                  startButton.textContent = "Try Again";
                  gameArea.classList.remove('hidden');
                  resetGame();
              });
              
              // Handle button press
              reactionButton.addEventListener('mousedown', function() {
                  if (!gameActive || reactionButton.disabled) return;
                  
                  // Clear any existing timers to be safe
                  clearAllTimers();
                  
                  // Start the sequence
                  isHolding = true;
                  buttonPressTime = Date.now();
                  reactionButton.textContent = "WAIT FOR GREEN LIGHT";
                  resultDisplay.textContent = "Watch the traffic light...";
                  feedbackDisplay.textContent = "";
                  
                  // Turn on red light
                  resetLights();
                  redLight.classList.add('active');
                  
                  // Random wait time between 2-5 seconds before yellow
                  const redWaitTime = Math.floor(Math.random() * 3000) + 2000;
                  waitTimer = setTimeout(function() {
                      if (!isHolding) return;
                      
                      // Turn on yellow light
                      redLight.classList.add('active');
                      yellowLight.classList.add('active');
                      
                      // Wait 0.5-1.5 seconds before green
                      const yellowWaitTime = Math.floor(Math.random() * 1000) + 500;
                      yellowTimer = setTimeout(function() {
                          if (!isHolding) return;
                          
                          // Turn on green light
                          greenLightOn = true;
                          waitingForRelease = true;
                          greenLightTime = Date.now();
                          
                          redLight.classList.remove('active');
                          yellowLight.classList.remove('active');
                          greenLight.classList.add('active');
                          
                          reactionButton.textContent = "RELEASE NOW!";
                      }, yellowWaitTime);
                      
                  }, redWaitTime);
              });
              
              // Handle button release
              reactionButton.addEventListener('mouseup', function() {
                  if (!gameActive || reactionButton.disabled) return;
                  
                  // If not holding, do nothing
                  if (!isHolding) return;
                  
                  // No longer holding
                  isHolding = false;
                  
                  // Clear any pending timers
                  clearAllTimers();
                  
                  // If released before green light
                  if (!greenLightOn) {
                      // Released too early
                      body.classList.add('early-release');
                      setTimeout(function() {
                          body.classList.remove('early-release');
                      }, 500);
                      
                      resultDisplay.textContent = "Too early! You released before the green light.";
                      feedbackDisplay.textContent = "Try again!";
                      reactionButton.textContent = "HOLD ME";
                      resetLights();
                      return;
                  }
                  
                  // If waiting for release and green light is on
                  if (waitingForRelease && greenLightOn) {
                      // Calculate reaction time
                      const releaseTime = Date.now();
                      const reactionTime = releaseTime - greenLightTime;
                      
                      // Display result
                      displayResult(reactionTime);
                      
                      // Disable button temporarily
                      reactionButton.disabled = true;
                      
                      // Re-enable after 2 seconds
                      setTimeout(function() {
                          reactionButton.disabled = false;
                          reactionButton.textContent = "HOLD ME";
                          resetLights();
                          gameActive = true;
                      }, 2000);
                  }
              });
              
              // Display the result
              function displayResult(reactionTime) {
                  resultDisplay.textContent = \`Your reaction time: \${reactionTime} ms\`;
                  
                  // Provide feedback based on reaction time
                  let feedback = "";
                  if (reactionTime < 150) {
                      feedback = "Impossible! Are you cheating? 🤨";
                  } else if (reactionTime < 200) {
                      feedback = "Superhuman reflexes! 🚀";
                  } else if (reactionTime < 250) {
                      feedback = "Lightning fast! ⚡";
                  } else if (reactionTime < 300) {
                      feedback = "Excellent reflexes! 🏆";
                  } else if (reactionTime < 350) {
                      feedback = "Very good! 👏";
                  } else if (reactionTime < 400) {
                      feedback = "Good reaction time! 👍";
                  } else if (reactionTime < 500) {
                      feedback = "Average reaction time";
                  } else if (reactionTime < 600) {
                      feedback = "A bit slow, but okay";
                  } else if (reactionTime < 800) {
                      feedback = "You might be tired... 😴";
                  } else {
                      feedback = "Were you distracted? 🤔";
                  }
                  
                  feedbackDisplay.textContent = feedback;
              }
              
              // Reset the lights
              function resetLights() {
                  redLight.classList.remove('active');
                  yellowLight.classList.remove('active');
                  greenLight.classList.remove('active');
              }
              
              // Clear all timers
              function clearAllTimers() {
                  if (waitTimer) {
                      clearTimeout(waitTimer);
                      waitTimer = null;
                  }
                  if (yellowTimer) {
                      clearTimeout(yellowTimer);
                      yellowTimer = null;
                  }
              }
              
              // Reset the game
              function resetGame() {
                  // Reset game state
                  isHolding = false;
                  greenLightOn = false;
                  waitingForRelease = false;
                  gameActive = true;
                  
                  // Clear any existing timers
                  clearAllTimers();
                  
                  // Reset UI
                  reactionButton.disabled = false;
                  reactionButton.textContent = "HOLD ME";
                  resultDisplay.textContent = "";
                  feedbackDisplay.textContent = "";
                  resetLights();
              }
              
              // Initial setup
              resetGame();
              gameActive = false;
          </script>
      </body>
      </html>
    `);
    iframeDoc.close();
    
    // Return cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This Traffic Light Reaction Game tests your reaction time using a stoplight system. It measures how quickly you can 
          respond to a visual stimulus, which is crucial for activities like driving, sports, or any situation requiring quick reflexes.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How to play:</strong> Press and hold the red button. The traffic light will cycle from red to yellow to green.
          When the light turns green, release the button as quickly as possible! The game will measure how quickly you responded.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>What it measures:</strong> This tests your simple reaction time - the time between a single stimulus (green light) 
          and your response (releasing the button). Average reaction times range from 200-250ms for young adults, with slower times for 
          complex decisions.
        </p>
      </div>
      
      <div className="h-[600px] rounded-lg overflow-hidden" ref={containerRef}>
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500">Loading traffic light game...</p>
        </div>
      </div>
      
      <div className="mt-4 text-gray-700">
        <p className="text-sm">
          <strong>Note:</strong> Simple reaction time tasks like this provide a good baseline measurement but don't capture the 
          complexity of real-world reflexes which often involve decision-making and multiple options.
        </p>
      </div>
    </div>
  );
};

export default TrafficLightGame; 