function GenericEnemy () {
  this.hp = this.maxHp();
  this.position = {x : 0, y : 0};
}

GenericEnemy.prototype.spawnAtPosition = function() {
  gMap.setCellValue(this.position, this.CssClasses().base);
};

GenericEnemy.prototype.clearPosition = function () {
  gMap.setCellValue(this.position, 'empty');
};

GenericEnemy.prototype.spawner = function () {
  this.position.x = getRandomInt(0, gMap.columnCount);
  this.position.y = getRandomInt(0, gMap.rowCount);
  if (gMap.getCellValue(this.position) === 'empty') {
    this.spawnAtPosition();
  }
  else
    this.spawner();
};

GenericEnemy.prototype.verifyIfPlayer = function(targetCellValue) {
  if (targetCellValue === 'player') {
    this.attackSound().play();
    gMap.setCellValue(this.position, this.CssClasses().attacking);
    gPlayer.takeDamages(1);
    return true;
  }
  return false;
};

GenericEnemy.prototype.moveVector = function () {
  return [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: -1, y: 0},
      {x: 0, y: -1},
      {x: 1, y: 0}
    ][getRandomInt(0, 5)];
};
    
GenericEnemy.prototype.play = function () {
  let himself = this;
  let timeBetweenMoves = getRandomInt(300, 801);

  function selectMove(timestamp) {
    if (timestamp > timeBetweenMoves) {
      timeBetweenMoves = Math.floor(timestamp) + getRandomInt(300, 801);
      himself.move(himself.moveVector())
    }
    if (himself.hp > 0)
      requestAnimationFrame(selectMove);
  }
  selectMove();
};

GenericEnemy.prototype.move = function (vector) {
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

GenericEnemy.prototype.die = function (){
  let himself = this;
  gBoom.play();
  gBasicEnemiesArr.splice(gBasicEnemiesArr.findIndex(function (enemy) {
    return (
        himself.position.x === enemy.position.x && 
        himself.position.y === enemy.position.y);
  }), 1);
  gMap.setCellValue(this.position, 'empty');
};

GenericEnemy.prototype.takeDamages = function (damages) {
  this.hp -= damages;
  if (this.hp <= 0){
    this.die();
  }
};
