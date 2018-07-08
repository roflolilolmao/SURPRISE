function Player (){
  this.maxHp = 15;
  this.hp = this.maxHp;
  this.damages = 1;
  this.range = 1;

  this.spawnAtPosition = function(){
    if (gMap.compareCells(this.position, gMap.exit))
      nextMap();
    gMap.setCellValue(this.position, 'player');
  };

  this.clearPosition = function (){
    let newValue = 'empty';
    if (gMap.compareCells(this.position, gMap.entry))
      newValue = 'entry';
    
    gMap.setCellValue(this.position, newValue);
  };

  this.verifyIfPowerUp = function(targetCellValue){
    if (targetCellValue === 'ruby'){
      gScore += 1;
      updateScore();
    }
  };

  this.move = function (x, y) {
    let targetCell = {x: this.position.x + x, y: this.position.y + y};
    
    if (gMap.outOfBounds(targetCell))
      return;
    
    let targetCellValue = gMap.getCellValue(targetCell);
    
    if (gMap.cellContainsEnemy(targetCell)){
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
    
    if (l.length < 1)
      return;
    
    l[0].takeDamages(this.damages);
  };

  this.triggerAttackAnimation = function (){
    let container = gMap.getCellDOM(this.position);
    let animationsArr = [];

    for (let i = 0; i < 4; i++){
      let newAnimation = document.createElement('div');
      container.appendChild(newAnimation);
      newAnimation.innerHTML = "👊";

      newAnimation.style.position = 'absolute';
      newAnimation.style.width = "100%";
      newAnimation.style.height = "100%";
      newAnimation.style.transform = "rotate(" + (i * 90) + "deg)";
      newAnimation.style.lineHeight = container.offsetHeight + "px";
      animationsArr.push(newAnimation);
    }
    animationsArr[1].style.top = "0px";
    animationsArr[2].style.top = "0px";
    animationsArr[3].style.top = "0px";
    this.animateFists(container, animationsArr, this.range);
  };

  this.animateFists = function (container, arr){
    let start = null;
    let pxRange = this.range * parseInt(container.offsetHeight);
    let progress;
    let actualRange;

    function punchIt(timestamp){
      if (start === null)
        start = timestamp;
      actualRange = (timestamp - start);
      progress = Math.floor((timestamp - start) / 2);
      arr[0].style.top = progress + "px";
      arr[1].style.left = -(progress) + "px";
      arr[2].style.top = -(progress) + "px";
      arr[3].style.left = progress + "px";
      if (progress < pxRange){
        window.requestAnimationFrame(punchIt);
      }
      else {
        arr.forEach(function (element){
          element.remove();
        });
        arr = null;
      }
    }
    window.requestAnimationFrame(punchIt);
  };

  this.attack = function (){
    this.triggerAttackAnimation();
    let this_ = this;
    
    let attackIfEnemyInRange = function(targetCell)
    {
      if (gMap.cellContainsEnemy(targetCell))
        this_.findEnemyToHitAndHit(targetCell);
    };
    
    attackIfEnemyInRange({x: this.position.x + 1, y: this.position.y});
    attackIfEnemyInRange({x: this.position.x - 1, y: this.position.y});
    attackIfEnemyInRange({x: this.position.x, y: this.position.y + 1});
    attackIfEnemyInRange({x: this.position.x, y: this.position.y - 1});
  }
}