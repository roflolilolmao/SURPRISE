function Map()
{
  this.asciiMap = {
      'empty': ' ',
      'wall': 'S',
      'powerup': 'u',
      'player': 'R',
      'entry': 'p',
      'nothing_yet': 'r',
      'boss': 'i',
      'door': 's',
      'enemy': 'e',
      
      'attacking': '👊',
      'enemy_attacking': '✋'
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

  this.generateWall = function(walls)
  {
    let this_ = this;
    walls.forEach(
        function(wall)
        {
          this_.setCellValue(wall, 'wall');
        });
  };
  
  this.createWallCoordinates = function(startingPoint, direction)
  {
    let currentPoint = {x: startingPoint.x, y: startingPoint.y};
    let walls = [];
    
    while(
        !this.outOfBounds(currentPoint) &&
        this.getCellValue(currentPoint) === 'empty')
    {
      walls.push(currentPoint);

      currentPoint = {
          x: currentPoint.x + direction.x,
          y: currentPoint.y + direction.y
        };
    }
    
    return walls;
  };

  this.generateRandomInnerWall = function()
  {
    let roomCorner = {
        x: getRandomInt(2, this.columnCount - 3),
        y: getRandomInt(2, this.rowCount - 3)
      };

    let twoRandomDirections = function()
    {
      let possible_directions = [
          {x: 0, y: 1},
          {x: -1, y: 0},
          {x: 0, y: -1},
          {x: 1, y: 0}
        ];

      let first = getRandomInt(0, 4);
      let second = getRandomInt(0, 4);
      while (first === second)
        second = getRandomInt(0, 4);

      return [
          possible_directions[first],
          possible_directions[second]
        ];
    };

    let directions = twoRandomDirections();
    let walls1 = this.createWallCoordinates(roomCorner, directions[0]);
    let perpendicularDirections = [
        {x: directions[0].y, y: directions[0].x},
        {x: -directions[0].y, y: -directions[0].x}
      ];
    walls1 = walls1.map(
        function(wall)
        {
          return {
              x: wall.x, 
              y: wall.y, 
              p1: perpendicularDirections[0],
              p2: perpendicularDirections[1]
            };
        });
   
    let walls2 = this.createWallCoordinates(
        {x: roomCorner.x + directions[1].x, y: roomCorner.y + directions[1].y},
        directions[1]);
    perpendicularDirections = [
        {x: directions[1].y, y: directions[1].x},
        {x: -directions[1].y, y: -directions[1].x}
      ];
    walls2 = walls2.map(
        function(wall)
        {
          return {
              x: wall.x, 
              y: wall.y, 
              p1: perpendicularDirections[0],
              p2: perpendicularDirections[1]
            };
        });
    
    let this_ = this;
    
    let validateWall = function(walls, direction)
    {
      let result = true;
      
      walls.forEach(
          function(wall)
          {
            if (
                this_.getCellValue(this_.addVector(wall, wall.p1)) ==='wall' ||
                this_.getCellValue(this_.addVector(wall, wall.p2)) ==='wall')
              result = false;
          });
          
      return result;
    };
    
    let walls = walls1.concat(walls2);
    
    if (
        walls.length == 0 ||
        !validateWall(walls1, directions[0]) ||
        !validateWall(walls2, directions[1]))
      return;

    this.generateWall(walls);
    
    let randomCellOnWall = walls[getRandomInt(1, walls.length - 1)];
    
    let randomCellLeftOfWall = {
        x: randomCellOnWall.x + randomCellOnWall.p1.x,
        y: randomCellOnWall.y + randomCellOnWall.p1.y
      };
    let randomCellRightOfWall = {
        x: randomCellOnWall.x + randomCellOnWall.p2.x,
        y: randomCellOnWall.y + randomCellOnWall.p2.y
      };
      
    this.generateDoors(walls, randomCellLeftOfWall);
    this.generateDoors(walls, randomCellRightOfWall);
  };

  this.generateDoors = function(walls, cell)
  {    
    while(
        this.pathFinding(cell, this.entry) == null ||
        this.pathFinding(cell, this.exit) == null)
    {
      let index = getRandomInt(0, walls.length);
      this.setCellValue(walls[index], 'door');
      walls.splice(index, 1);
    }
  };
  
  this.generateMap = function(entry)
  {
    for (let x = 0; x < this.columnCount; x++)
      for (let y = 0; y < this.rowCount; y++)
        this.setCellValue({x: x, y: y}, 'empty');
    
    let walls = this.createWallCoordinates(
        {x: 0, y: 0},
        {x: 1, y: 0});
    walls = walls.concat(this.createWallCoordinates(
        {x: 0, y: 1},
        {x: 0, y: 1}));
    walls = walls.concat(this.createWallCoordinates(
        {x: this.columnCount - 1, y: this.rowCount - 1},
        {x: 0, y: -1}));
    walls = walls.concat(this.createWallCoordinates(
        {x: this.columnCount - 2, y: this.rowCount - 1},
        {x: -1, y: 0}));
    
    this.generateWall(walls);
    
    this.entry = {x: entry, y: 0};
    this.exit = {x: getRandomInt(1, this.columnCount - 1), y: this.rowCount - 1};
    
    this.setCellValue(this.entry, 'entry');
    this.setCellValue(this.exit, 'entry');

    for (let i = 0; i < getRandomInt(2, 10); i++)
      this.generateRandomInnerWall();
  };
  
  this.compareCells = function(a, b)
  {
    return a.x == b.x && a.y == b.y;
  };

  this.addVector = function(cell, v)
  {
    return {
        x: cell.x + v.x,
        y: cell.y + v.y,
        score: cell.score,
        parent: cell
      };
  };
  
  this.pathFinding = function(start, end)
  {
    let possible_directions = [
        {x: 0, y: 1},
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: 0}
      ];

    let currentCell = {x: start.x, y: start.y, score: 0, parent: null};
    let openCells = [];
    let closedCells = [];

    let this_ = this;  // whatever man

    let findAdjacentCells = function(cell)
    {
      possible_directions.forEach(
          function(direction)
          {
            let neighbour = this_.addVector(cell, direction);

            if (this_.outOfBounds(neighbour))
              return;

            if (this_.getCellValue(neighbour) == 'wall')
              return;

            for (let i = 0; i < closedCells.length; i++)
              if (this_.compareCells(closedCells[i], neighbour))
                return;

            for (let i = 0; i < openCells.length; i++)
              if (this_.compareCells(openCells[i], neighbour))
              {
                if (openCells[i].score > neighbour.score)
                {
                  openCells[i].score = neighbour.score;
                  openCells[i].parent = neighbour.parent;
                }

                return;
              }

            openCells.push(neighbour);
          });
    };

    findAdjacentCells(currentCell);

    while (openCells.length != 0)
    {
      let bestScore = this.rowCount * this.columnCount;
      let nextCell = null;

      openCells.forEach(
          function(cell)
          {
            if (cell.score > bestScore)
              return;

            bestScore = cell.score;
            nextCell = cell;
          });

      closedCells.push(currentCell);

      currentCell = nextCell;

      for (let i = 0; i < openCells.length; i++)
        if (this.compareCells(nextCell, openCells[i]))
        {
          openCells.splice(i, 1);
          break;
        }

      if (this.compareCells(currentCell, end))
        return currentCell;

      findAdjacentCells(currentCell);
    }

    return null;
  };

  this.setCellValue = function(cell, value_)
  {
    removeClass(this.grid[cell.x][cell.y], this.getCellValue(cell));
    this.grid[cell.x][cell.y].innerHTML = this.asciiMap[value_];
    addClass(this.grid[cell.x][cell.y], value_);
  };

  this.getCellValue = function(cell)
  {
    return this.grid[cell.x][cell.y].getAttribute('class').split(' ').slice(-1)[0];
  };
  
  this.outOfBounds = function(cell)
  {
    let result = 
        cell.x < 0 ||
        cell.x >= this.columnCount ||
        cell.y < 0 ||
        cell.y >= this.rowCount;
    return result;
  }
  
  this.nextMap = function()
  {
    this.generateMap(this.exit.x);
    return this.entry;
  };

  this.initGrid();
  this.generateMap(getRandomInt(1, this.columnCount - 1));
}
