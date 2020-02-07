'use strict';

var WALL = '#';
var FOOD = '.';
var EMPTY = ' ';
var SUPER_FOOD = '&#x2022;';
var CHERRY = '&#x1f352;';

var gBoard;
var gGame = {
  score: 0,
  FoodCount: -1,
  isOn: false,
  isVictory: false
};
var gIntervalCherry;

function init() {
  gGame.score = 0;
  gGame.FoodCount = -1;
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  document.querySelector('.game-over-modal').hidden = true;
  document.querySelector('header h3 span').innerText = gGame.score;
  printMat(gBoard, '.board-container');
  gGame.isOn = true;
  gGame.isVictory = false;
  gIntervalCherry = setInterval(placeCherry, 15000);
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      if (i === 0 || i === SIZE - 1 ||  // Put up walls
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {
        board[i][j] = WALL;
      } else if ((i === 1 && j === 1) || (i === 1 && j === SIZE - 2) ||  // Put super food in corners
        (i === SIZE - 2 && j === 1) || (i === SIZE - 2 && j === SIZE - 2)) {
        board[i][j] = SUPER_FOOD;
      } else {  // Put down floor
        board[i][j] = FOOD;
        gGame.FoodCount++;
      }
    }
  }
  return board;
}

function placeCherry() {
  var emptyPoses = getEmptyPositions(gBoard);
  if (!emptyPoses.length) return;
  var randomIdx = getRandomIntInclusive(0, emptyPoses.length - 1);
  var pos = emptyPoses[randomIdx];
  gBoard[pos.i][pos.j] = CHERRY;
  renderCell(pos, CHERRY);
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
  if (!gGame.FoodCount) { // Check if we ate all the food - VICTORY
    gGame.isVictory = true;
    gameOver();
  }
}

function gameOver() {
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gIntervalCherry);
  gIntervalGhosts = null;
  document.querySelector('.game-over-modal p').innerText = (gGame.isVictory) ? 'VICTORY!!!' : 'GAME OVER';
  document.querySelector('.game-over-modal').hidden = false;
}