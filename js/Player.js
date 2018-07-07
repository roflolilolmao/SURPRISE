function Player (){
  this.maxHp = 15;
  this.hp = this.maxHp;
  this.position = {x : 10, y : 10};
  this.damages = 1;

  this.spawnAtPosition = function(){
    if (gMap.compareCells(this.position, gMap.exit))
    {
      this.position = gMap.nextMap();
    }
    
    gMap.setCellValue(this.position, 'player');
  };

  this.clearPosition = function (){
    gMap.setCellValue(this.position, 'empty');
  };

  this.verifyIfPowerUp = function(targetCellValue){
    if (targetCellValue === 'powerup'){
      gScore += 10;
      updateScore();
    }
  };

  this.move = function (x, y) {
    let targetCell = {x: this.position.x + x, y: this.position.y + y};
    
    if (gMap.outOfBounds(targetCell))
      return;
    
    let targetCellValue = gMap.getCellValue(targetCell);
    
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

  this.findEnemyToHitAndHit = function (cell) {
    let l = gBasicEnemiesArr.filter(function (enemy) {
      return gMap.compareCells(enemy.position, cell);
    });
    l[0].takeDamages(this.damages);
  };

  this.attack = function (){
    gMap.setCellValue(this.position, 'attacking');
    
    let this_ = this;
    
    let attackIfEnemyInRange = function(targetCell)
    {
      if (gMap.getCellValue(targetCell) === 'enemy')
        this_.findEnemyToHitAndHit(targetCell);
    };
    
    attackIfEnemyInRange({x: this.position.x + 1, y: this.position.y});
    attackIfEnemyInRange({x: this.position.x - 1, y: this.position.y});
    attackIfEnemyInRange({x: this.position.x, y: this.position.y + 1});
    attackIfEnemyInRange({x: this.position.x, y: this.position.y - 1});
  }
}