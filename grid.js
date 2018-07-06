function Grid()
{
  this.initGrid = function()
  {  
    this.grid = [];
    
    let columnCount = 30;
    let rowCount = 20;

    for (y = 0; y < rowCount; y++)
    {
      let rowDiv = document.createElement('div');
      this.grid.push([]);

      rowDiv.setAttribute('id', 'row_' + y);
      rowDiv.setAttribute('class', 'rows');
      
      document.getElementsByTagName('body')[0].appendChild(rowDiv);
      
      rowDiv.style.width = '90vw';
      rowDiv.style.height = rowDiv.offsetWidth / columnCount + 'px';
      
      console.log(rowDiv.offsetWidth);
      console.log(rowDiv.offsetWidth / columnCount);
      
      for (x = 0; x < columnCount; x++)
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
  }

  this.setCellValue = function(x, y, value)
  {
    grid[x][y].innerHtml = value;
  }
}

var grid = new Grid();
