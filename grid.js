function Map()
{
  this.asciiMap = {
      'wall': 'S',
      'door': 's',
      'player': 'R',
      'empty': ' ',
      'powerup': 'u'
    };
    
  this.columnCount = 30;
  this.rowCount = 20;

  this.initGrid = function()
  {  
    this.grid = [];
    for (let x = 0; x < this.columnCount; x++)
    {
      this.grid.push([]);
      for (let y = 0; y < this.rowCount; y++)
        this.grid[x].push(document.createElement('div'));
    }

    for (let y = 0; y < this.rowCount; y++)
    {
      let rowDiv = document.createElement('div');

      rowDiv.setAttribute('id', 'row_' + y);
      rowDiv.setAttribute('class', 'rows');
      
      document.getElementById('game_container').appendChild(rowDiv);
      
      rowDiv.style.width = '90vw';
      let height = Math.ceil(rowDiv.offsetWidth / this.columnCount);
      rowDiv.style.width = 30 * height + 'px';
      rowDiv.style.height = height + 'px';
      
      for (let x = 0; x < this.columnCount; x++)
      {
        let div = this.grid[x][y];
        rowDiv.appendChild(div);

        div.setAttribute('id', 'grid_' + x + '_' + y);
        div.setAttribute('class', 'cell empty');

        div.style.width = rowDiv.offsetHeight + 'px';
        div.style.height = rowDiv.offsetHeight + 'px';
        div.style.lineHeight = rowDiv.offsetHeight + 'px';
      }
    }
  };
  
  this.generateWall = function(starting_point, direction)
  {
    let x = starting_point.x;
    let y = starting_point.y;
    
    while(
        x >= 0 && x < this.columnCount &&
        y >= 0 && y < this.rowCount &&
        this.getCellValue(x, y) != 'wall')
    {
      this.setCellValue(x, y, 'wall');
      
      x += direction.x;
      y += direction.y;
    }
  }
  
  this.generateMap = function()
  {
    this.generateWall(
        {x: 0, y: 0},
        {x: 1, y: 0});
    this.generateWall(
        {x: 0, y: 1},
        {x: 0, y: 1});
    this.generateWall(
        {x: this.columnCount - 1, y: this.rowCount - 1},
        {x: 0, y: -1});
    this.generateWall(
        {x: this.columnCount - 2, y: this.rowCount - 1},
        {x: -1, y: 0});
        
    // generateRandomInnerRooms    
    let randomPointInRange = function(small_x, big_x, small_y, big_y)
    {
      let randomValueInRange = function(small, big)
      {
        let range = big - small;
        return Math.round(Math.random() * range) + small;
      };
      
      return {
          x: randomValueInRange(small_x, big_x),
          y: randomValueInRange(small_y, big_y)
        };
    };
    
    let roomCorner = randomPointInRange(2, this.columnCount - 3, 2, this.rowCount - 3);
    
    this.setCellValue(roomCorner.x, roomCorner.y, 'wall');
    
    let chooseDirection = function()
    {
      return Math.round(Math.random()) == 0 ? -1: 1;
    };
    
    let direction_x = chooseDirection();
    let direction_y = chooseDirection();
    
  };

  this.setCellValue = function(x, y, value)
  {
    this.grid[x][y].innerHTML = this.asciiMap[value];
    addClass(this.grid[x][y], value);
  };
  
  this.getCellValue = function(x, y)
  {
    return this.grid[x][y].getAttribute('class').split(' ').slice(-1)[0];
  };
}
