let circles = []; // array to store the circles
let connections = []; // 2D array to store the connections between the circles
let player1;
let player2;
let playerTurn = 1;
let playerIndex;
let gameOver = false;
let P1walls = [];
let P2walls = [];
let wallPlaced = false;
let playerNeedsWall=false;
let playerWallCounter = [0,0]; // counter for player 1's walls
function setup() {
  // create the canvas element
  createCanvas(windowWidth-20, windowHeight-20);
  for (let i = 0; i < 25; i++) {
    // generate 10 circles
    let x = random(150, windowWidth-150); // x position of the circle
    let y = random(150, windowHeight-150); // y position of the circle
    let r = ((windowWidth + windowHeight)/2)*.03; // radius of the circle
    let c = color(10, 50, 30); // color of the circle
    let circle = new Circle(x, y, r, c); // create a new circle
    let valid = true; // flag to check if the circle is valid
    // check if the new circle is at least 50 pixels away from all other circles
    if(i===0){
      x = windowWidth/2; 
      y = windowHeight/2;
    }
    for (let j = 0; j < circles.length; j++) {
      if (dist(circle.x, circle.y, circles[j].x, circles[j].y) < 140 || dist(circle.x, circle.y, circles[j].x, circles[j].y) > 1000 && i>0) {
        valid = false;
        i--;
        break;
      }
    }
    if (valid) {
      circles.push(circle); // add the circle to the array
    }
  }

  // initialize the 'connections' array
  for (let i = 0; i < circles.length; i++) {
    connections[i] = new Array(circles.length).fill(false);
  }
  let button = createButton("Wall");
  // specify the callback function that will be executed when the button is clicked
  button.mousePressed(onButtonClick);
  button.position(windowWidth/2, windowHeight-60);
  button.size(width*.05,height*.05)
  player1 = new Player(100, 100, 1);
  let randomIndex = floor(random(0, circles.length)); // generate a random index within the range of the 'circles' array
  player1.move(circles[randomIndex].x, circles[randomIndex].y);
  player2 = new Player(100, 100, 2);
  randomIndex = floor(random(0, circles.length)); // generate a random index within the range of the 'circles' array
  player2.move(circles[randomIndex].x, circles[randomIndex].y);
  
strokeWeight(5);
}
function onButtonClick() {
  playerNeedsWall =true;
}

function draw() {
  if(playerTurn==1){
    background(238, 205,195);
  }else{
    background(136,155,174);
  } // clear the canvas
  stroke(0, 0, 0);
  // iterate over all pairs of circles
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      // check if the circles are not the same circle and do not have a line connecting them to the same circle
      if (i !== j && !(i === connections[j][j] && j === connections[i][i]) && dist(circles[i].x, circles[i].y, circles[j].x, circles[j].y) <= 250) {
        // draw a line segment between the circles
        line(circles[i].x, circles[i].y, circles[j].x, circles[j].y);
        connections[i][j] = true; // mark the connection as 'true' in the 'connections' array
      }
    }
  }
  // draw the circles
  
  player1.show();
  player2.show();
  
  // determine the current player's index in the 'circles' array
  if (playerTurn === 1) {
    playerIndex = circles.findIndex(circle => circle.x === player1.x && circle.y === player1.y);
  } else {
    playerIndex = circles.findIndex(circle => circle.x === player2.x && circle.y === player2.y);
  }
  
  // turn the lines connected to the player's current position red
  stroke(255, 0, 0); // set the stroke color to red
  for (let i = 0; i < circles.length; i++) {
    if (playerTurn === 1 && !(circles[i].x === player2.x && circles[i].y === player2.y) || playerTurn === 2 && !(circles[i].x === player1.x && circles[i].y === player1.y)) { // check if the circle is not occupied by the other player
      if (playerIndex !== i && (connections[playerIndex][i] || connections[i][playerIndex])) { // check if the circles are connected in either direction
        if((playerTurn === 1 && !P2walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y)) || (playerTurn === 2 && !P1walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y))){
        line(circles[playerIndex].x, circles[playerIndex].y, circles[i].x, circles[i].y);
      }
      }
    }
  }
  stroke(0, 0, 0);
  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
  }
  player1.show();
  player2.show();
  // check if the 'playerNeedsWall' flag is set to 'true'
  if (playerNeedsWall) {
    for (let i = 0; i < circles.length; i++) {
      if (playerTurn === 1 && !(circles[i].x === player2.x && circles[i].y === player2.y) || playerTurn === 2 && !(circles[i].x === player1.x && circles[i].y === player1.y)) { // check if the circle is not occupied by the other player
        if (playerIndex !== i && (connections[playerIndex][i] || connections[i][playerIndex])) { // check if the circles are connected in either direction
          if((playerTurn === 1 && !P2walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y)) || (playerTurn === 2 && !P1walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y)) && (playerTurn === 2 && !P2walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y)) || (playerTurn === 1 && !P1walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y))){
            if (!(P1walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y)) && !(P2walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y))) {
            if (playerWallCounter[playerTurn-1] >= 6) {
              
            }else{
              fill(0, 0, 255); // set the fill color to blue
              noStroke(); // disable the stroke
              ellipse(circles[i].x, circles[i].y, circles[i].r * 2, circles[i].r * 2); // draw a blue circle over the connected circles
              // check if the mouse was pressed within the bounds of the blue circle
              if (mouseIsPressed && dist(mouseX, mouseY, circles[i].x, circles[i].y) <= circles[i].r) {
                
                // turn the circle red
                playerNeedsWall = false; // reset the flag

                // add the wall to the appropriate array
                
                if (playerTurn === 1) {
                  circles[i].c = color(255, 0, 0);
                  P1walls.push(new Wall(circles[i].x, circles[i].y));
                  playerWallCounter[playerTurn-1]++
                } else {
                  circles[i].c = color(0, 100, 255);
                  P2walls.push(new Wall(circles[i].x, circles[i].y));
                  playerWallCounter[playerTurn-1]++
                }
                // update the 'connections' array
                connections[playerIndex][i] = false;
                connections[i][playerIndex] = false;
                break; // exit the loop
              }
            }
          }
    }
      }
    }
  }
  }
  
}

function mouseClicked() {
  for (let i = 0; i < circles.length; i++) {
    // check if the mouse position is within the bounds of the circle
    if (circles[i].contains(mouseX, mouseY)) {
      // check if the clicked circle is not occupied by the other player and is connected to the current player's position
      if (playerTurn === 1 && !(circles[i].x === player2.x && circles[i].y === player2.y) && (connections[playerIndex][i] || connections[i][playerIndex]) && !P2walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y) || playerTurn === 2 && !(circles[i].x === player1.x && circles[i].y === player1.y) && (connections[playerIndex][i] || connections[i][playerIndex]) && !P1walls.find(wall => wall.x === circles[i].x && wall.y === circles[i].y)) {
        // move the current player to the position of the clicked circle
        if (playerTurn === 1) {
          player1.move(circles[i].x, circles[i].y);
        } else {
          player2.move(circles[i].x, circles[i].y);
        }
        playerTurn = (playerTurn === 1) ? 2 : 1; // switch the player turn
        playerNeedsWall = false;
        playerIndex = (playerTurn === 1) ? circles.findIndex(circle => circle.x === player1.x && circle.y === player1.y) : circles.findIndex(circle => circle.x === player2.x && circle.y === player2.y); // update the 'playerIndex' variable
        redraw(); // redraw the canvas
      }
      break; // exit the loop
    }
  }
}


class Circle {
    // define the Circle class
    constructor(x, y, r, c) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = c;
    }
  
    show() {
      // draw the circle
      fill(this.c);
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
  
    contains(px, py) {
      // check if the given point is within the bounds of the circle
      let d = dist(px, py, this.x, this.y);
      return d <= this.r;
    }
  
    intersectsLine(x1, y1, x2, y2) {
      // check if the line segment intersects the circle
      let slope = (y2 - y1) / (x2 - x1); // slope of the line
      let intercept = y1 - slope * x1; // y-intercept of the line
      let distance = abs(slope * this.x - this.y + intercept) / sqrt(pow(slope, 2) + 1); // distance between the center of the circle and the line
      return distance <= this.r;
    }
    
    intersectsCircle(other) {
      // check if the line segment between the centers of the two circles intersects either of the circles
      return this.intersectsLine(other.x, other.y, this.x, this.y) || other.intersectsLine(other.x, other.y, this.x, this.y);
    }
  }

  class Player {
    constructor(x, y, colour) {
      this.x = x;
      this.y = y;
      this.colour = colour;
    }
  
    move(x, y) {
      // check if there is a wall between the current position and the destination position
      if (P1walls.some(wall => wall.blocksMovement(this.x, this.y, x, y)) || P2walls.some(wall => wall.blocksMovement(this.x, this.y, x, y))) {
        // do not allow the player to move if there is a wall between the current position and the destination position
        return;
      }
      this.x = x;
      this.y = y;
    }
  
    show() {
      if(this.colour===1){fill(128,0,0);}else if(this.colour===2){fill(3,187,133);}else{console.log(this.colour); fill(0)}
      ellipse(this.x, this.y, 40, 40);
      fill(0);
    }
  }
  
  

  class Wall {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    blocksMovement(x1, y1, x2, y2) {
      // check if the wall is between the two given circles
      return this.x === x1 && this.y === y1 && this.x === x2 && this.y === y2;
    }
  }
  
  