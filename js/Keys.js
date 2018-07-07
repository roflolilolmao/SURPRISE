document.onkeydown = function (e){
  if (e.key === 'w'){
    gPlayer.move(0, -1);
  }
  if (e.key === 's'){
    gPlayer.move(0, 1);
  }
  if (e.key === 'a'){
    gPlayer.move(-1, 0);
  }
  if (e.key === 'd'){
    gPlayer.move(1, 0);
  }
};