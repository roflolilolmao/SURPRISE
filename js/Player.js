function Player (){
  this.maxHp = 15;
  this.hp = this.maxHp;
  this.position = {x : 10, y : 10};

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
    if (targetCellValue !== 'wall') {
      this.verifyIfPowerUp(targetCellValue);
      this.clearPosition();
      this.position.x += x;
      this.position.y += y;
      this.spawnAtPosition();
    }
  };
}