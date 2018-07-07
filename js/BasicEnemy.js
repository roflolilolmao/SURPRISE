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

  this.play = function () {
    let possibleDirections = [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: 0}
      ];
      
    let himself = this;
    let timeBetweenMoves = getRandomInt(300, 801);

    function selectRandomMove(timestamp) {
      if (timestamp > timeBetweenMoves) {
        timeBetweenMoves = Math.floor(timestamp) + getRandomInt(300, 801);
        himself.move(possibleDirections[getRandomInt(0, 5)])
      }
      if (himself.hp > 0)
        requestAnimationFrame(selectRandomMove);
    }
    selectRandomMove();
  };

  this.move = function (vector) {
    let targetCell = {
        x: this.position.x + vector.x,
        y: this.position.y + vector.y
      };
      
    if (gMap.outOfBounds(targetCell))
      return;
    
    let targetCellValue = gMap.getCellValue(targetCell);

    if (this.verifyIfPlayer(targetCellValue))
      return;
      
    if (targetCellValue === 'empty') {
      this.clearPosition();
      this.position.x += vector.x;
      this.position.y += vector.y;
      this.spawnAtPosition();
    }
  };

  this.die = function (){
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