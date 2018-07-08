document.onkeydown = function (e){

  if (!gMusicActive)
  {
    gCoolBassLine.loop = true;
    gCoolBassLine.play();
    
    gMusicActive = true;
  }
  
  if (e.key === 'w'){
    gPlayer.move(0, -1);
  }
  else if (e.key === 's'){
    gPlayer.move(0, 1);
  }
  else if (e.key === 'a'){
    gPlayer.move(-1, 0);
  }
  else if (e.key === 'd'){
    gPlayer.move(1, 0);
  }
  else if (e.key === 'q'){
    gPlayer.attack();
  }
};