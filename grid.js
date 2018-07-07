function Map()
{
  this.asciiMap = {
      'wall': 'S',
      'door': 's'
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
        div = this.grid[x][y];
        rowDiv.appendChild(div);

        div.setAttribute('id', 'grid_' + x + '_' + y);
        div.setAttribute('class', 'cell');

        div.style.width = rowDiv.offsetHeight + 'px';
        div.style.height = rowDiv.offsetHeight + 'px';
        div.style.lineHeight = rowDiv.offsetHeight + 'px';
      }
    }
  };
  
  this.generateMap = function()
  {
    // generateEnclosingWalls
    for (let x = 0; x < this.columnCount; x++)
    {
      this.setCellValue(x, 0, 'wall');
      this.setCellValue(x, this.rowCount - 1, 'wall');
    }
    
    for (let y  = 0; y < this.rowCount; y++)
    {
      this.setCellValue(0, y, 'wall');
      this.setCellValue(this.columnCount - 1, y, 'wall');
    }

    // generateRandomInnerRooms    
    let randomPointInRange = function(small_x, big_x, small_y, big_y)
    {
      let randomValueInRange = function(small, big)
      {
        let range = big - small;
        return Math.round(Math.random() * range) + small;
      }
      
      return {
          x: randomValueInRange(small_x, big_x),
          y: randomValueInRange(small_y, big_y)
        }
    }
    
    let roomCorner = randomPointInRange(2, this.columnCount - 3, 2, this.rowCount - 3);
    
    this.setCellValue(roomCorner.x, roomCorner.y, 'wall');
    
    let chooseDirection = function()
    {
      let lol = Math.round(Math.random())
      return lol == 0 ? -1: 1;
    }
    
    let direction_x = chooseDirection();
    let direction_y = chooseDirection();
    
    for (let x = roomCorner.x; x > 0 && x < this.columnCount - 1; x += direction_x)
    {
      this.setCellValue(x, roomCorner.y, 'wall');
    }
    
    for (let y = roomCorner.y; y > 0 && y < this.rowCount - 1; y += direction_y)
    {
      this.setCellValue(roomCorner.x, y, 'wall');
    }
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
