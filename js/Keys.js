document.onkeydown = function (e){
  if (e.key === 'w'){
    gPlayer.move(0, -1);
    endTurn();
  }
  else if (e.key === 's'){
    gPlayer.move(0, 1);
    endTurn();
  }
  else if (e.key === 'a'){
    gPlayer.move(-1, 0);
    endTurn();
  }
  else if (e.key === 'd'){
    gPlayer.move(1, 0);
    endTurn();
  }
  else if (e.key === 'q'){
    gPlayer.attack();
    endTurn();
  }
  else
    console.log(e.key);
};