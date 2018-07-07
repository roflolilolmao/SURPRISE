function Player (){
  this.maxHp = 15;
  this.hp = this.maxHp;
  this.position = {x: gMap.entry.x, y: gMap.entry.y};
  this.damages = 1;
  this.range = 1;

  this.spawnAtPosition = function(){
    if (gMap.compareCells(this.position, gMap.exit))
      this.position = gMap.nextMap();
    gMap.setCellValue(this.position, 'player');
  };

  this.clearPosition = function (){
    let newValue = 'empty';
    if (gMap.compareCells(this.position, gMap.entry))
      newValue = 'entry';
    
    gMap.setCellValue(this.position, newValue);
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

  this.triggerAttackAnimation = function (){
    let container = gMap.getCellDOM(this.position);
    let animationsArr = [];

    for (let i = 0; i < 4; i++){
      let newAnimation = document.createElement('div');
      container.appendChild(newAnimation);
      newAnimation.innerHTML = "👊";

      newAnimation.style.position = 'relative';
      newAnimation.style.width = "100%";
      newAnimation.style.height = "100%";
      newAnimation.style.transform = "rotate(" + (i * 90) + "deg)";
      newAnimation.style.lineHeight = container.offsetHeight + "px";

      animationsArr.push(newAnimation);
    }
    animationsArr[0].style.top = -(container.offsetHeight) + "px";
    animationsArr[1].style.top = -(2*container.offsetHeight) + "px";
    animationsArr[1].style.left =  "0px";
    animationsArr[2].style.top = (4*container.offsetHeight*-1) + 8 + "px";
    animationsArr[3].style.top = (4*container.offsetHeight*-1) + 8 + "px";
    animationsArr[3].style.right = (container.offsetWidth*-1) + "px";
    this.animateFists(container, animationsArr, this.range);
  };

  this.animateFists = function (container, arr, range){
    let start;
    let pxRange = this.range * container.offsetHeight;

    function punchIt(timestamp){
      let progress;
      if (!start)
        start = timestamp;
      progress = (timestamp - start) % pxRange;
      arr[0].style.top = progress - container.offsetHeight + "px";
      arr[1].style.left = -(progress) + "px";
      arr[2].style.top = -(progress) - 3*container.offsetHeight + "px";
      arr[3].style.left = progress + "px";

      if (progress < pxRange){
        window.requestAnimationFrame(punchIt);
      }
    }
    window.requestAnimationFrame(punchIt);
  };

  this.attack = function (){
    this.triggerAttackAnimation();
    //gMap.setCellValue(this.position, 'attacking');
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