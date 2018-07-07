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
      'enemy': 'e'
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
        this.getCellValue(x, y) === 'empty')
    {
      this.setCellValue(x, y, 'wall');

      x += direction.x;
      y += direction.y;
    }
  };

  this.generateRandomInnerWall = function()
  {
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
    this.generateWall(roomCorner, directions[0]);
    this.generateWall(
        {x: roomCorner.x + directions[1].x, y: roomCorner.y + directions[1].y},
        directions[1]);
  };

  this.generateMap = function(entry)
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
    
    this.entry = {x: entry, y: 0};
    this.exit = {x: getRandomInt(1, this.columnCount - 1), y: this.rowCount - 1};
    
    this.setCellValue(this.entry.x, this.entry.y, 'entry');
    this.setCellValue(this.exit.x, this.exit.y, 'entry');

    for (let i = 0; i < getRandomInt(2, 5); i++)
      this.generateRandomInnerWall();

    this.generateDoors();
  };

  this.generateDoors = function()
  {    
    let walls = [];
    for (let x = 1; x < this.columnCount - 1; x++)
      for (let y = 1; y < this.rowCount - 1; y++)
        if (this.getCellValue(x, y) == 'wall')
          walls.push({x: x, y: y});

    while(this.pathFinding(this.entry, this.exit) == null)
    {
      let index = getRandomInt(0, walls.length);
      let wall = walls[index];

      if (this.getCellValue(wall.x, wall.y) == 'wall')
        this.setCellValue(wall.x, wall.y, 'door');
      
      walls.splice(index, 1);
    }
  };

  this.pathFinding = function(start, end)
  {
    let compareCells = function(a, b)
    {
      return a.x == b.x && a.y == b.y;
    };

    let addVector = function(cell, v)
    {
      return {
          x: cell.x + v.x,
          y: cell.y + v.y,
          score: cell.score,
          parent: cell
        };
    };

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
            let neighbour = addVector(cell, direction);

            if (
                neighbour.x > this_.columnCount ||
                neighbour.x < 0 ||
                neighbour.y > this_.rowCount ||
                neighbour.y < 0)
              return;

            if (this_.getCellValue(neighbour.x, neighbour.y) == 'wall')
              return;

            for (let i = 0; i < closedCells.length; i++)
              if (compareCells(closedCells[i], neighbour))
                return;

            for (let i = 0; i < openCells.length; i++)
              if (compareCells(openCells[i], neighbour))
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
        if (compareCells(nextCell, openCells[i]))
        {
          openCells.splice(i, 1);
          break;
        }

      if (compareCells(currentCell, end))
        return currentCell;

      findAdjacentCells(currentCell);
    }

    return null;
  };

  this.setCellValue = function(x, y, value_)
  {
    removeClass(this.grid[x][y], this.getCellValue(x, y));
    this.grid[x][y].innerHTML = this.asciiMap[value_];
    addClass(this.grid[x][y], value_);
  };

  this.getCellValue = function(x, y)
  {
    return this.grid[x][y].getAttribute('class').split(' ').slice(-1)[0];
  };

  this.initGrid();
  this.generateMap(getRandomInt(1, this.columnCount - 1));
}
