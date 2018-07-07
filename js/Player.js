function Player (){
  this.maxHp = 15;
  this.hp = this.maxHp;
  this.position = {x : 10, y : 10};
  this.damages = 1;

  this.spawnAtPosition = function(){
    gMap.setCellValue(this.position.x, this.position.y, 'player');
  };

  this.clearPosition = function (){
    gMap.setCellValue(this.position.x, this.position.y, 'empty');
  };

  this.verifyIfPowerUp = function(targetCellValue){
    if (targetCellValue === 'powerup'){
      gScore += 10;
      updateScore();
    }
  };

  this.move = function (x, y) {
    let targetCellValue = gMap.getCellValue(this.position.x + x, this.position.y + y);
    if (targetCellValue === 'enemy'){
      this.takeDamages(1);
    }
    else if (targetCellValue !== 'wall') {
      this.verifyIfPowerUp(targetCellValue);
      this.clearPosition();
      this.position.x += x;
      this.position.y += y;
      this.spawnAtPosition();
    }
  };

  this.takeDamages = function(damages){
    this.hp -= damages;
    updateHp();
    if (this.hp <= 0)
      console.log('Game Over');
  };

  this.findEnemyToHitAndHit = function (x, y){
    gBasicEnemiesArr.filter(function (enemy){
      return enemy.position.x === x && enemy.position.y === y;
    })[0].takeDamages(this.damages);
  };

  this.attack = function (){
    if (gMap.getCellValue(this.position.x + 1, this.position.y) === 'enemy'){
      this.findEnemyToHitAndHit(this.position.x + 1, this.position.y);
    }
    if (gMap.getCellValue(this.position.x - 1, this.position.y) === 'enemy'){
      this.findEnemyToHitAndHit(this.position.x - 1, this.position.y);
    }
    if (gMap.getCellValue(this.position.x, this.position.y + 1) === 'enemy'){
      this.findEnemyToHitAndHit(this.position.x, this.position.y + 1);
    }
    if (gMap.getCellValue(this.position.x, this.position.y - 1) === 'enemy'){
      this.findEnemyToHitAndHit(this.position.x, this.position.y - 1);
    }
  }
}