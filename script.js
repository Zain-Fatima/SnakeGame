        const canvas = document.getElementById("game");
        const cntx = canvas.getContext("2d");

        const CELL_SIZE = 20;
        const NUM_CELLS = canvas.width / CELL_SIZE;
        let speed = 7;
        let xCord = 0;
        let yCord = 0;
        let isPaused = false;
        let isSpeedBoosted = false;
        let powerUpActive = false;
        let powerUpX, powerUpY;
        let powerUpDuration = 5000;

        class snakeCord {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        }
        let cnt = NUM_CELLS;
        let size = canvas.width / cnt - 2;
        let headX = Math.floor(cnt / 2);
        let headY = Math.floor(cnt / 2);
        const snakeArray = [];
        let initialLength = 2;
        let fruitX, fruitY;
        let score = 0;
        const echoFruit = new Audio("gulp.mp3");
        let powerUpTimeout;
        var gameStarted = false;

        function playGame() {
            clearScreen();
            changeSnakePosition();
            if (isGameOver()) {
                gameOver();
                clearScreen();
                cntx.fillStyle =  'white';
                cntx.font = "50px Verdana";
                let gar = cntx.createLinearGradient(0,0,canvas.width,0);
                gar.addColorStop("0" ,"magenta");
                gar.addColorStop("0.5" ,"yellow");
                gar.addColorStop("1.0" ,"red");
                cntx.fillStyle = gar;
                cntx.fillText("Game Over! ",canvas.width/6.5,canvas.height/2);
                return;          
            }
            if (!isPaused) {
                checkCollision();
                drawFruit();
                drawSnake();
                drawScore();
            }
            if (score > 100) speed = 11;
            setTimeout(playGame, 1000 / speed);
        }

        function activatePowerUp() {
            if (powerUpActive) return;
            powerUpActive = true;
            const boostedSpeed = speed + 2;
            clearTimeout(powerUpTimeout);
            powerUpTimeout = setTimeout(() => {
                powerUpActive = false;
                speed = boostedSpeed - 2;
            }, powerUpDuration);
        }

        function isGameOver() {
            if (xCord === 0 && yCord === 0) return false;
            if (headX < 0 || headX >= cnt || headY < 0 || headY >= cnt) return true;
            for (let i = 0; i < snakeArray.length; i++) {
                if (snakeArray[i].x === headX && snakeArray[i].y === headY) return true;
            }
            return false;
        }

        function drawScore() {
            cntx.fillStyle = 'white';
            cntx.font = "10px Verdana";
            cntx.fillText("Score " + score, canvas.width - 50, 10);
        }

        function clearScreen() {
            cntx.fillStyle = 'black';
            cntx.fillRect(0, 0, canvas.width, canvas.height);
        }

         function drawFruit() {
            cntx.fillStyle = 'red';
            cntx.fillRect(fruitX * cnt, fruitY * cnt, size, size);
        }
        function drawSnake() {
            cntx.fillStyle = 'green';
            for (let i = 0; i < snakeArray.length; i++) {
                cntx.fillRect(snakeArray[i].x * cnt, snakeArray[i].y * cnt, size, size);
            }
            snakeArray.push(new snakeCord(headX, headY));
            while (snakeArray.length > initialLength) {
                snakeArray.shift();
            }
            cntx.fillStyle = 'orange';
            cntx.fillRect(headX * cnt, headY * cnt, size, size);
        }
        
        function changeSnakePosition() {
            headX = headX + xCord;
            headY = headY + yCord;
        }

        function generateFruit() {
            fruitX = Math.floor(Math.random() * cnt);
            fruitY = Math.floor(Math.random() * cnt);
        }

        function checkCollision() {
            if (fruitX === headX && fruitY === headY) {
                generateFruit();
                initialLength++;
                score += 10;
                echoFruit.play();
            }
        }

        function startGame() {
            document.getElementById("startScreen").style.display = "none";
            document.getElementById("gameScreen").style.display = "flex";

            const playerName = document.getElementById("playerName").value;
            document.getElementById("playerScore").innerText = `${playerName}'s Score: 0`;

            generateFruit();
            playGame();
        }

        function gameOver() {
            document.getElementById("gameScreen").style.display = "none";
            document.getElementById("gameOverScreen").style.display = "flex";
            document.getElementById("finalScore").innerText = `Your Score: ${score}`;
        }

        function restartGame() {
            snakeArray.length = 0;
            headX = Math.floor(cnt / 2);
            headY = Math.floor(cnt / 2);
            initialLength = 2;
            score = 0;
            xCord = 0;
            yCord = 0;
            isPaused = false;
            isSpeedBoosted = false;
            powerUpActive = false;
            clearTimeout(powerUpTimeout);
            generateFruit();
            document.getElementById("gameOverScreen").style.display = "none";
            document.getElementById("gameScreen").style.display = "flex";
            playGame();
        }

        document.getElementById("startForm").addEventListener("submit", function (event) {
            event.preventDefault();
            startGame();
        });

        document.body.addEventListener('keydown', function (event) {
            if (event.keyCode === 32) {
                isPaused = !isPaused;
                if (!isPaused) playGame();
            }
            if (event.key === "s" || event.key === "S") {
                if (!isSpeedBoosted) {
                    speed *= 2;
                    isSpeedBoosted = true;
                    setTimeout(() => {
                        speed /= 2;
                        isSpeedBoosted = false;
                    }, 3000);
                }
            }
            if (event.keyCode === 38) {
                if (yCord === 1) return;
                yCord = -1;
                xCord = 0;
            } else if (event.keyCode === 40) {
                if (yCord === -1) return;
                yCord = 1;
                xCord = 0;
            } else if (event.keyCode === 37) {
                if (xCord === 1) return;
                yCord = 0;
                xCord = -1;
            } else if (event.keyCode === 39) {
                if (xCord === -1) return;
                yCord = 0;
                xCord = 1;
            }
        });

        // Start the game when the page loads
        document.addEventListener("DOMContentLoaded", function () {
            // Load audio file
            echoFruit.load();

            // Listen for form submission to start the game
            document.getElementById("startForm").addEventListener("submit", function (event) {
                event.preventDefault();
                startGame();
            });
        });
    