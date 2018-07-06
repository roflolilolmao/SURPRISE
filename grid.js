function Grid()
{
  this.initGrid = function()
  {  
    this.grid = [];
    
    this.columnCount = 30;
    this.rowCount = 20;

    for (let y = 0; y < rowCount; y++)
    {
      let rowDiv = document.createElement('div');
      this.grid.push([]);

      rowDiv.setAttribute('id', 'row_' + y);
      rowDiv.setAttribute('class', 'rows');
      
      document.getElementsByTagName('body')[0].appendChild(rowDiv);
      
      rowDiv.style.width = '90vw';
      rowDiv.style.height = rowDiv.offsetWidth / columnCount + 'px';
      
      for (let x = 0; x < columnCount; x++)
      {
        let div = document.createElement('div');
        this.grid[y].push(div);
        
        rowDiv.appendChild(div);

        div.setAttribute('id', 'grid_' + x + '_' + y);
        div.setAttribute('class', 'cell');
        
        div.style.width = rowDiv.offsetHeight + 'px';
        div.style.height = rowDiv.offsetHeight + 'px';
      }
    }
  };
  
  this.generateMap = function()
  {
    for (let x = 0; x < this.columnCount; x++)
    {
      
    }
  };

  this.setCellValue = function(x, y, value)
  {
    this.grid[x][y].innerHtml = value;
  };
}

var grid = new Grid();
