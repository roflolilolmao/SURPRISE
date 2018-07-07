function BasicEnemy (){
  this.maxHp = 15;
  this.hp = this.maxHp;
  this.position = {x : 0, y : 0};

  this.spawnAtPosition = function(){
    gMap.setCellValue(this.position.x, this.position.y, 'enemy');
  };

  this.clearPosition = function (){
    gMap.setCellValue(this.position.x, this.position.y, 'empty');
  };

  this.spawner = function (){
    this.position.x = getRandomInt(0, gMap.columnCount);
    this.position.y = getRandomInt(0, gMap.rowCount);
    if (gMap.getCellValue(this.position.x, this.position.y) === 'empty') {
      this.spawnAtPosition();
    }
    else
      this.spawner();
  };

  this.verifyIfPlayer = function(targetCellValue){
    if (targetCellValue === 'player'){
      gPlayer.takeDamages(1);
      return true;
    }
    return false;
  };

  this.playTurn = function (){
    switch (getRandomInt(0, 5)){
      case 0 :
        return;
      case 1 :
        this.move(0, 1);
        break;
      case 2 :
        this.move(0, -1);
        break;
      case 3 :
        this.move(1, 0);
        break;
      case 4:
        this.move(-1, 0);
        break;
    }
  };

  this.move = function (x, y) {
    let targetCellValue = gMap.getCellValue(this.position.x + x, this.position.y + y);
    if (targetCellValue !== 'wall' && targetCellValue !== 'powerup') {
      if (this.verifyIfPlayer(targetCellValue)) {
        return;
      }
      this.clearPosition();
      this.position.x += x;
      this.position.y += y;
      this.spawnAtPosition();
    }
  };
}