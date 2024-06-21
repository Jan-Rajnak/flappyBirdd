// Get canvas and context
var cvs = document.getElementById("gameCanvas");
var ctx = cvs.getContext("2d");

// Bird parameters
var bird = {
    x : 1000,
    y : 450,
    velocity : 0,
    speed : 2, // This is the speed at which the bird will move to the right
    color : "red"
};

// Add event listener for key press
document.addEventListener("keydown", function(event) {
    if(event.code === "Space" ) {
        bird.velocity = -15; // Adjust this value to change the jump height

        // Change bird color to make it flash
        if (bird.color === "red") {
            bird.color = "yellow";
        } else {
            bird.color = "red";
        }
    }
});

// Add event listener for mouse down
document.addEventListener("mousedown", function(event) {
    if(event.button === 0) { // Check if the left mouse button was clicked
        bird.velocity = -15; // Adjust this value to change the jump height

        // Change bird color to make it flash
        if (bird.color === "red") {
            bird.color = "yellow";
        } else {
            bird.color = "red";
        }
    }
});

// Gravity
var gravity = 1.5;

// Pipe parameters
var pipes = [];
var pipeWidth = 100; // Width of the pipes
var pipeGap = 250; // Gap between the top and bottom pipes
var pipeFrequency = 8000; // Frequency at which pipes are generated (in milliseconds)

// Function to generate a new pipe
function generatePipe() {
    var pipeHeight = Math.random() * cvs.height / 2; // Random height for the top pipe
    var pipe = {
        x: cvs.width,
        yTop: pipeHeight,
        yBottom: pipeHeight + pipeGap
    };
    pipes.push(pipe);

    pipeFrequency -= 10; // Decrease the frequency of pipe generation
    pipeGap -= 0.01; // Decrease the gap between the top and bottom pipes

    // Generate a new pipe after a certain time
    setTimeout(generatePipe, pipeFrequency);
}

// Initialize score
var score = 0;

// Function to check collision
function checkCollision(bird, pipe) {
    // Check collision with top pipe
    if(bird.x < pipe.x + pipeWidth && bird.x + 20 > pipe.x && bird.y < pipe.yTop && bird.y + 20 > 0) {
        return true;
    }
    // Check collision with bottom pipe
    if(bird.x < pipe.x + pipeWidth && bird.x + 20 > pipe.x && bird.y < cvs.height && bird.y + 20 > pipe.yBottom) {
        return true;
    }
    // Check collision with ground
    if(bird.y + 20 > cvs.height) {
        return true;
    }
    return false;
}


// Modify the draw function to draw the score and check for collision
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Draw bird
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 20, 0, Math.PI * 2, false);
    ctx.fillStyle = bird.color; // Use the bird's color
    bird.color = "red"; // Reset the bird's color
    ctx.fill();
    ctx.closePath();

    // Draw pipes and check for collision
    for(var i = 0; i < pipes.length; i++) {
        var p = pipes[i];

        // Draw top pipe
        ctx.beginPath();
        ctx.rect(p.x, 0, pipeWidth, p.yTop);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();

        // Draw bottom pipe
        ctx.beginPath();
        ctx.rect(p.x, p.yBottom, pipeWidth, cvs.height - p.yBottom);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();

        // Move pipe to the left
        p.x -= bird.speed;

        // Check for collision
        if(checkCollision(bird, p)) {
            console.log("Game Over!");
            return; // End the game
        }

        // Increment score and remove pipe if it's out of the canvas
        if(p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
            score++;
        }
    }

    // Draw score
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 50);

    // Apply gravity
    bird.y += bird.velocity;
    bird.velocity += gravity;

    // Reset velocity after a jump
    if(bird.velocity < 0) {
        bird.velocity += 1; // Adjust this value to change the speed of the jump
    }

    // Call draw function every 20 ms
    setTimeout(draw, 20);
}

// Start generating pipes
generatePipe();

// Start game loop
draw();