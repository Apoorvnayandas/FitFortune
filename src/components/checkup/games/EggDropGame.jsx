import { useEffect, useRef } from 'react';

const EggDropGame = () => {
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
          <title>Egg Drop Reflex Game</title>
          <style>
              body {
                  margin: 0;
                  overflow: hidden;
                  font-family: Arial, sans-serif;
                  background-color: #87CEEB;
              }
              #gameCanvas {
                  display: block;
                  background-color: #87CEEB;
              }
              #startScreen, #resultScreen {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  text-align: center;
                  background-color: rgba(255, 255, 255, 0.9);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              }
              button {
                  padding: 10px 20px;
                  font-size: 16px;
                  background-color: #4CAF50;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 20px;
              }
              button:hover {
                  background-color: #45a049;
              }
              h1 {
                  color: #333;
              }
              #resultDetails {
                  margin: 20px 0;
                  font-size: 18px;
              }
              .rating {
                  font-size: 24px;
                  font-weight: bold;
                  color: #FF5722;
                  margin: 15px 0;
              }
          </style>
      </head>
      <body>
          <canvas id="gameCanvas"></canvas>
          
          <div id="startScreen">
              <h1>Egg Drop Reflex Game</h1>
              <p>Move the basket with your mouse to catch falling eggs!</p>
              <p>The eggs will drop at unpredictable locations and speeds to test your reflexes.</p>
              <p><strong>Warning: This game is designed to be challenging!</strong></p>
              <button id="startButton">Start Game</button>
          </div>
          
          <div id="resultScreen" style="display: none;">
              <h1>Game Over!</h1>
              <div id="resultDetails"></div>
              <button id="restartButton">Play Again</button>
          </div>

          <script>
              // Canvas setup
              const canvas = document.getElementById('gameCanvas');
              const ctx = canvas.getContext('2d');
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;

              // Game elements
              const basket = {
                  x: canvas.width / 2,
                  y: canvas.height - 100,
                  width: 100,
                  height: 50,
                  color: '#8B4513'
              };

              // Game state
              let gameActive = false;
              let eggsCaught = 0;
              let eggsMissed = 0;
              let eggsDropped = 0;
              let totalReactionTime = 0;
              let catchTimes = [];
              let eggs = [];
              let lastEggTime = 0;
              const MAX_EGGS = 5;
              
              // DOM elements
              const startScreen = document.getElementById('startScreen');
              const resultScreen = document.getElementById('resultScreen');
              const resultDetails = document.getElementById('resultDetails');
              const startButton = document.getElementById('startButton');
              const restartButton = document.getElementById('restartButton');

              // Event listeners
              startButton.addEventListener('click', startGame);
              restartButton.addEventListener('click', resetGame);
              
              canvas.addEventListener('mousemove', (e) => {
                  if (gameActive) {
                      basket.x = e.clientX - basket.width / 2;
                      // Keep basket within canvas bounds
                      if (basket.x < 0) basket.x = 0;
                      if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
                  }
              });

              // Egg class
              class Egg {
                  constructor() {
                      this.radius = 15;
                      this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
                      this.y = -this.radius;
                      this.speed = Math.random() * 5 + 7; // Faster speeds between 7-12
                      this.color = '#FFFFFF';
                      this.dropTime = Date.now();
                      this.caught = false;
                      this.missed = false;
                  }

                  update() {
                      this.y += this.speed;
                      
                      // Check if egg is caught
                      if (!this.caught && !this.missed &&
                          this.y + this.radius >= basket.y && 
                          this.y - this.radius <= basket.y + basket.height &&
                          this.x + this.radius >= basket.x && 
                          this.x - this.radius <= basket.x + basket.width) {
                          
                          this.caught = true;
                          eggsCaught++;
                          const catchTime = Date.now() - this.dropTime;
                          totalReactionTime += catchTime;
                          catchTimes.push(catchTime);
                      }
                      
                      // Check if egg has fallen past the basket
                      if (!this.caught && !this.missed && this.y - this.radius > canvas.height) {
                          this.missed = true;
                          eggsMissed++;
                      }
                  }

                  draw() {
                      // Don't draw if caught or missed
                      if (this.caught || this.missed) return;
                      
                      // Draw egg
                      ctx.fillStyle = this.color;
                      ctx.beginPath();
                      ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.3, 0, 0, Math.PI * 2);
                      ctx.fill();
                      
                      // Add some egg details
                      ctx.fillStyle = '#FFFACD';
                      ctx.beginPath();
                      ctx.ellipse(this.x - 5, this.y - 5, this.radius/3, this.radius/2, 0, 0, Math.PI * 2);
                      ctx.fill();
                  }
              }

              // Game functions
              function startGame() {
                  startScreen.style.display = 'none';
                  gameActive = true;
                  resetGameState();
                  gameLoop();
                  
                  // Drop first egg after a short delay
                  setTimeout(dropEgg, Math.random() * 500 + 200);
              }

              function resetGame() {
                  resultScreen.style.display = 'none';
                  startGame();
              }

              function resetGameState() {
                  eggsCaught = 0;
                  eggsMissed = 0;
                  eggsDropped = 0;
                  totalReactionTime = 0;
                  catchTimes = [];
                  eggs = [];
                  lastEggTime = 0;
              }

              function dropEgg() {
                  if (eggsDropped < MAX_EGGS && gameActive) {
                      eggs.push(new Egg());
                      eggsDropped++;
                      lastEggTime = Date.now();
                      
                      // Schedule next egg drop if not reached max
                      if (eggsDropped < MAX_EGGS) {
                          // Very unpredictable timing - between 300ms and 1500ms
                          const nextEggDelay = Math.random() * 1200 + 300;
                          setTimeout(dropEgg, nextEggDelay);
                      }
                  }
              }

              function update() {
                  // Update all eggs
                  for (let i = 0; i < eggs.length; i++) {
                      eggs[i].update();
                  }
                  
                  // Check if game is over (all eggs have been accounted for)
                  if (eggsDropped >= MAX_EGGS && eggs.every(egg => egg.caught || egg.missed)) {
                      endGame();
                  }
              }

              function draw() {
                  // Clear canvas
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw sky background
                  ctx.fillStyle = '#87CEEB';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw ground
                  ctx.fillStyle = '#8B4513';
                  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
                  
                  // Draw grass
                  ctx.fillStyle = '#228B22';
                  ctx.fillRect(0, canvas.height - 30, canvas.width, 10);
                  
                  // Draw basket
                  ctx.fillStyle = basket.color;
                  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
                  
                  // Draw basket details (handle and texture)
                  ctx.fillStyle = '#6B4226';
                  ctx.fillRect(basket.x + 10, basket.y, 5, basket.height);
                  ctx.fillRect(basket.x + basket.width - 15, basket.y, 5, basket.height);
                  ctx.fillRect(basket.x, basket.y + basket.height/2, basket.width, 5);
                  
                  // Draw all eggs
                  for (let i = 0; i < eggs.length; i++) {
                      eggs[i].draw();
                  }
                  
                  // Draw score
                  ctx.fillStyle = '#000000';
                  ctx.font = '20px Arial';
                  ctx.fillText(\`Eggs Caught: \${eggsCaught}\`, 20, 30);
                  ctx.fillText(\`Eggs Missed: \${eggsMissed}\`, 20, 60);
                  ctx.fillText(\`Eggs Dropped: \${eggsDropped}/\${MAX_EGGS}\`, 20, 90);
              }

              function gameLoop() {
                  if (gameActive) {
                      update();
                      draw();
                      requestAnimationFrame(gameLoop);
                  }
              }

              function endGame() {
                  gameActive = false;
                  
                  // Calculate average reaction time
                  const avgReactionTime = totalReactionTime / catchTimes.length || 0;
                  
                  // Rate the player's reflexes
                  let reflexRating = "";
                  let reflexDescription = "";
                  
                  if (eggsCaught === 0) {
                      reflexRating = "Unable to rate";
                      reflexDescription = "You didn't catch any eggs! Try again.";
                  } else if (avgReactionTime < 400) {
                      reflexRating = "Superhuman! 🚀";
                      reflexDescription = "Your reflexes are incredibly fast! Professional gamer level!";
                  } else if (avgReactionTime < 550) {
                      reflexRating = "Lightning Fast! ⚡";
                      reflexDescription = "Your reflexes are exceptionally quick! Top tier!";
                  } else if (avgReactionTime < 700) {
                      reflexRating = "Very Quick! 🏆";
                      reflexDescription = "Great reflexes! You're faster than most people.";
                  } else if (avgReactionTime < 850) {
                      reflexRating = "Good Reflexes! 🥇";
                      reflexDescription = "Above average reaction time. Well done!";
                  } else if (avgReactionTime < 1000) {
                      reflexRating = "Decent Reflexes 🥈";
                      reflexDescription = "Your reflexes are about average. Not bad!";
                  } else if (avgReactionTime < 1200) {
                      reflexRating = "Average Reflexes 🥉";
                      reflexDescription = "Room for improvement, but still decent.";
                  } else {
                      reflexRating = "Could Use Some Practice 🏃";
                      reflexDescription = "Keep practicing to improve your reaction time!";
                  }
                  
                  // Display results
                  resultDetails.innerHTML = \`
                      <p>Eggs Caught: \${eggsCaught} out of \${MAX_EGGS}</p>
                      <p>Average Reaction Time: \${Math.round(avgReactionTime)} ms</p>
                      <div class="rating">\${reflexRating}</div>
                      <p>\${reflexDescription}</p>
                      \${catchTimes.length > 0 ? 
                        \`<p>Your reaction times: \${catchTimes.map(t => Math.round(t) + 'ms').join(', ')}</p>\` : ''}
                  \`;
                  
                  resultScreen.style.display = 'block';
              }

              // Initial setup
              window.addEventListener('resize', () => {
                  canvas.width = window.innerWidth;
                  canvas.height = window.innerHeight;
                  basket.y = canvas.height - 100;
              });

              // Draw initial screen
              draw();
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
          <strong>How to play:</strong> Move your mouse to control the basket and catch falling eggs.
          The game will measure your reaction time and provide a rating of your reflexes based on how quickly you respond.
        </p>
        <p className="text-gray-700 mb-4">
          This game tests continuous reaction time and hand-eye coordination, which are important skills for sports, 
          driving, and everyday tasks that require quick physical responses to visual stimuli.
        </p>
      </div>
      
      <div className="h-[600px] rounded-lg overflow-hidden" ref={containerRef}>
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500">Loading egg drop game...</p>
        </div>
      </div>
    </div>
  );
};

export default EggDropGame; 