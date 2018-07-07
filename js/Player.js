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

  this.moveUp = function(){
    if (gMap.getCellValue(this.position.x,this.position.y - 1) !== 'wall'){
      this.clearPosition();
      this.position.y--;
      this.spawnAtPosition();
    }
  };

  this.moveDown = function (){
    if (gMap.getCellValue(this.position.x,this.position.y + 1) !== 'wall'){
      this.clearPosition();
      this.position.y++;
      this.spawnAtPosition();
    }
  };

  this.moveLeft = function(){
    if (gMap.getCellValue(this.position.x - 1,this.position.y) !== 'wall'){
      this.clearPosition();
      this.position.x--;
      this.spawnAtPosition();
    }
  };

  this.moveRight = function(){
    if (gMap.getCellValue(this.position.x + 1,this.position.y) !== 'wall'){
      this.clearPosition();
      this.position.x++;
      this.spawnAtPosition();
    }
  };
}