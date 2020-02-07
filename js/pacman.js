var gPacman;
var PACMAN = '&#9786;';

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    gGame.FoodCount--;
    updateScore(1);
  } else if (nextCell === CHERRY) {
    updateScore(10);
  } else if (nextCell === SUPER_FOOD) {
    if (gPacman.isSuper) return;
    updateScore(1);
    handleSuperMode();
  } else if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      removeGhost(nextLocation.i, nextLocation.j);
    } else {
      gameOver()
      renderCell(gPacman.location, EMPTY);
      return;
    }
  }

  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, getPacmanHTML());
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      PACMAN = '&#x15E2;';
      nextLocation.i--;
      break;
    case 'ArrowDown':
      PACMAN = '&#x15E3;';
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      PACMAN = '&#x15E4;';
      nextLocation.j--;
      break;
    case 'ArrowRight':
      PACMAN = '&#x15E7;';
      nextLocation.j++;
      break;
    default: return null;
  }
  return nextLocation;
}

function handleSuperMode() {
  gPacman.isSuper = true;
  changeGhostsColor();
  setTimeout(function () {
    returnAllGhosts();
    gPacman.isSuper = false;
  }, 5000);
}

function getPacmanHTML() {
  return `<span style="color: yellow;">${PACMAN}</span>`
}