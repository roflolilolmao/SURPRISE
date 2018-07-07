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

BasicEnemy.prototype.CssClass = function()
{
  return 'enemy';
};
