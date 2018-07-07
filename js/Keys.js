document.onkeydown = function (e){
  if (e.key === 'w'){
    gPlayer.moveUp();
  }
  if (e.key === 's'){
    gPlayer.moveDown();
  }
  if (e.key === 'a'){
    gPlayer.moveLeft();
  }
  if (e.key === 'd'){
    gPlayer.moveRight();
  }
};