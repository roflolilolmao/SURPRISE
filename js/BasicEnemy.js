function BasicEnemy () {
  this.maxHp = 1;
  this.hp = this.maxHp;
  this.position = {x : 0, y : 0};
  this.moveStartTime = "";

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
    let himself = this;

    function selectRandomMove(timestamp) {
      if (himself.moveStartTime  === ""){
        himself.moveStartTime = timestamp;
      }
      console.log(himself.moveStartTime);
      if (timestamp - himself.moveStartTime > 1) {
        himself.moveStartTime = "";
      }
      else {
        switch (getRandomInt(0, 5)) {
          case 0 :
            break;
          case 1 :
            himself.move(0, 1);
            break;
          case 2 :
            himself.move(0, -1);
            break;
          case 3 :
            himself.move(1, 0);
            break;
          case 4:
            himself.move(-1, 0);
            break;
        }
      }
      requestAnimationFrame(selectRandomMove);
    }
    selectRandomMove();
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