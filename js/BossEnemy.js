function BossEnemy()
{
  GenericEnemy.call(this);
}

BossEnemy.prototype = Object.create(GenericEnemy.prototype);
BossEnemy.prototype.constructor = BossEnemy;

BossEnemy.prototype.maxHp = function()
{
  return 5;
};

BossEnemy.prototype.CssClasses = function()
{
  return {base: 'boss', attacking: 'boss_attacking'};
};

BossEnemy.prototype.moveVector = function () {
  let path = gMap.pathFinding(gPlayer.position, this.position, false);
  
  console.log(path);
  
  if (path == null)
    return GenericEnemy.call(this);
  
  console.log([
      path.x , this.position.x,
      path.y , this.position.y
    ]);
  return {
      x: path.x - this.position.x,
      y: path.y - this.position.y
    };
};
