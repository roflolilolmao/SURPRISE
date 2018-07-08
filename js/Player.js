function Player (){
  this.maxHp = 5;
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

  this.verifyIfRuby = function (targetCellValue){
    if (targetCellValue === 'ruby'){
      gBlingotron.play();
      gScore += 1;
      updateScore();
      let footerText = chooseRandomString([
        "Hoooo riches !",
        "Money's funny even in a rich man dungeon ...",
        "Ruby, Ruby, Ruby, Ruby !Do you, do you, do you, do you Know what you're doing, doing, to me! Ruby, Ruby, Ruby, Ruby!",
        "Yay ! A red Flower ! Oh shoot, it's just a shiny stone ...."
      ]);
      updateFooter(footerText);
    }
  };

  this.verifyIfPowerUp = function(targetCellValue){
    if (targetCellValue === 'powerup') {
      gPchrt.play();
      let die = getRandomInt(1,101);
      if (die < 30){
        this.hp = this.maxHp;
        updateHp();
        updateFooter("You feel reborn.")
      }
      else if (die < 40){
        this.maxHp++;
        updateHp();
        updateFooter("That piece of meat was probably some legendary gecko, because after eating eat you feel like you can endure more ...");
      }
      else if (die < 50){
        this.damages++;
        updateDamage();
        updateFooter("Who knew that eating this banana you found on the ground would make you stronger ?");
      }
      else if (die < 60){
        this.range++;
        updateRange();
        updateFooter("The rainbows shooting out of your fists seems to reach further now that you're wearing this ring ...");
      }
      else {
        this.hp++;
        if (this.hp > this.maxHp)
          this.hp = this.maxHp;
        updateHp();
        updateFooter("Some water ! You feel a bit better.");

      }
    }
  };

  this.verifyIfDoor = function (targetCellValue){
    if (targetCellValue === 'door'){
      gDingDong.play();
      let footerText = chooseRandomString([
        "KNOCK KNOCK !",
        "Where's the handle ?",
        "Watch out ! Coming through !",
        "That door had a funny graffiti of a spider with a top hat. Probably some bored cultist draw it years ago ..."
      ]);
      updateFooter(footerText);
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
      this.verifyIfDoor(targetCellValue);
      this.verifyIfRuby(targetCellValue);
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
      gameOver();
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

  this.attack = function () {
    this.triggerAttackAnimation();
    let this_ = this;
    gPif.play();

    let attackIfEnemyInRange = function (targetCell) {
      if (gMap.cellContainsEnemy(targetCell))
        this_.findEnemyToHitAndHit(targetCell);
    };
    for (let i = this.range; i > 0; i--) {
      let right = {x: this.position.x + i, y: this.position.y};
      if (!gMap.outOfBounds(right))
        attackIfEnemyInRange({x: this.position.x + i, y: this.position.y});
      let left = {x: this.position.x - i, y: this.position.y};
      if(!gMap.outOfBounds(left))
        attackIfEnemyInRange(left);
      let bottom = {x: this.position.x, y: this.position.y + i};
      if(!gMap.outOfBounds(bottom))
        attackIfEnemyInRange(bottom);
      let top = {x: this.position.x, y: this.position.y - i};
      if(!gMap.outOfBounds(top))
        attackIfEnemyInRange(top);
    }
  }
}