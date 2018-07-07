function BasicEnemy () {
  this.maxHp = 1;
  this.hp = this.maxHp;
  this.position = {x : 0, y : 0};

  this.spawnAtPosition = function() {
    gMap.setCellValue(this.position, 'enemy');
  };

  this.clearPosition = function () {
    gMap.setCellValue(this.position, 'empty');
  };

  this.spawner = function () {
    this.position.x = getRandomInt(0, gMap.columnCount);
    this.position.y = getRandomInt(0, gMap.rowCount);
    if (gMap.getCellValue(this.position) === 'empty') {
      this.spawnAtPosition();
    }
    else
      this.spawner();
  };

  this.verifyIfPlayer = function(targetCellValue) {
    if (targetCellValue === 'player') {
      gMap.setCellValue(this.position, 'enemy_attacking');
      gPlayer.takeDamages(1);
      return true;
    }
    return false;
  };

  this.playTurn = function () {
    let numberOfMoves = getRandomInt(1, 4);
    for(let i = 1; i < numberOfMoves; i++) {
      switch (getRandomInt(0, 5)) {
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
    }
  };

  this.move = function (x, y) {
    let targetCellValue = 
        gMap.getCellValue({x: this.position.x + x, y: this.position.y + y});
    
    if (targetCellValue !== 'wall' && targetCellValue !== 'powerup') {

      if (this.verifyIfPlayer(targetCellValue))
        return;

      this.clearPosition();
      this.position.x += x;
      this.position.y += y;
      this.spawnAtPosition();
    }
  };

  this.die = function () {
    let himself = this;
    gBasicEnemiesArr.splice(gBasicEnemiesArr.findIndex(function (enemy) {
      return himself.position.x === enemy.position.x && himself.position.y === enemy.position.y;
    }), 1);
    gMap.setCellValue(this.position, 'empty');
  };

  this.takeDamages = function (damages) {
    this.hp -= damages;
    if (this.hp <= 0){
      this.die();
    }
  };
}