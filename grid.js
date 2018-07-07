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
  };

  this.setCellValue = function(x, y, value)
  {
    this.grid[x][y].innerHTML = this.asciiMap[value];
    addClass(this.grid[x][y], value);
  };
}
