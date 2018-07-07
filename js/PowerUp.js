function PowerUp(){
  this.position = {x : 0, y : 0};

  this.spawner = function (){
    this.position.x = getRandomInt(0, gMap.columnCount);
    this.position.y = getRandomInt(0, gMap.rowCount);
    if (gMap.getCellValue(this.position) === 'empty') {
      gMap.setCellValue(this.position, 'powerup');
    }
    else
      this.spawner();
  }
}