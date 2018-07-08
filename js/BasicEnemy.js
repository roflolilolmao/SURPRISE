function BasicEnemy()
{
  GenericEnemy.call(this);
}

BasicEnemy.prototype = Object.create(GenericEnemy.prototype);
BasicEnemy.prototype.constructor = BasicEnemy;

BasicEnemy.prototype.maxHp = function()
{
  return 1;
};

BasicEnemy.prototype.CssClasses = function()
{
  return {base: 'enemy', attacking: 'enemy_attacking'};
};
