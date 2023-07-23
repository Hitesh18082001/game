class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Striker {
  constructor() {
    this.width = 100;
    this.height = 20;
    this.x = width / 2 - this.width / 2;
    this.y = height - 30;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  move(step) {
    this.x += step;
    this.x = constrain(this.x, 0, width - this.width);
  }

  reset() {
    this.x = width / 2 - this.width / 2;
  }
}

class Ball {
  constructor() {
    this.radius = 10;
    this.x = width / 2;
    this.y = height / 2;
    this.speedX = 5;
    this.speedY = -5;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  bounce(striker) {
    if (this.y + this.radius >= striker.y &&
      this.y + this.radius <= striker.y + striker.height &&
      this.x >= striker.x &&
      this.x <= striker.x + striker.width) {
      this.speedY *= -1;
    }

    if (this.x + this.radius >= width || this.x - this.radius <= 0) {
      this.speedX *= -1;
    }

    if (this.y - this.radius <= 0) {
      this.speedY *= -1;
    }
  }

  hits(brick) {
    const halfWidth = this.radius / 2;
    const halfHeight = this.radius / 2;
    const centerX = this.x;
    const centerY = this.y;
    const brickX = brick.x + brick.width / 2;
    const brickY = brick.y + brick.height / 2;
    return abs(centerX - brickX) < halfWidth + brick.width / 2 &&
      abs(centerY - brickY) < halfHeight + brick.height / 2;
  }

  reverseY() {
    this.speedY *= -1;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
  }
}

let bricks = [];
let striker;
let ball;
let lives = 3;
let score = 0;

function setup() {
  createCanvas(400, 400);
  createBricks();
  striker = new Striker();
  ball = new Ball();
}

function createBricks() {
  const brickRowCount = 3;
  const brickColumnCount = 6;
  const brickWidth = 60;
  const brickHeight = 20;
  const brickMargin = 10;

  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      const x = c * (brickWidth + brickMargin) + brickMargin;
      const y = r * (brickHeight + brickMargin) + brickMargin;
      bricks.push(new Brick(x, y, brickWidth, brickHeight));
    }
  }
}

function draw() {
  background(0);


  for (let brick of bricks) {
    brick.show();
  }


  striker.show();


  ball.show();


  textSize(20);
  fill(255);
  text(`Lives: ${lives}`, 10, height - 20);
  text(`Score: ${score}`, width - 100, height - 20);

  if (keyIsDown(LEFT_ARROW)) {
    striker.move(-5);
  } else if (keyIsDown(RIGHT_ARROW)) {
    striker.move(5);
  }

  ball.move();
  ball.bounce(striker);

  for (let i = bricks.length - 1; i >= 0; i--) {
    if (ball.hits(bricks[i])) {
      bricks.splice(i, 1);
      score++;
      ball.reverseY();
      break;
    }
  }


  if (ball.y + ball.radius > height) {
    lives--;
    if (lives === 0) {
      gameOver();
    } else {
      ball.reset();
      striker.reset();
    }
  }

  if (bricks.length === 0) {
    youWin();
  }
}

function gameOver() {
  textSize(32);
  fill(255);
  text("Game Over", width / 2 - 80, height / 2);
  noLoop();
}

function youWin() {
  textSize(32);
  fill(255);
  text("You Win!", width / 2 - 80, height / 2);
  textSize(20);
  text(`Final Score: ${score}`, width / 2 - 80, height / 2 + 30);
  noLoop();
}