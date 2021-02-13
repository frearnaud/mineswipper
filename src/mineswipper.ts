class Cell {
  isRevealed: boolean;
  containsMine: boolean;
  minesSurrounding: number;
  flagged: boolean;
  row: number;
  column: number;

  constructor(containsMine: boolean, row: number, column: number) {
    this.isRevealed = false;
    this.containsMine = containsMine;
    this.row = row;
    this.column = column;
    this.minesSurrounding = -1;
    this.flagged = false;
  }

  // return false if there is a mine in this cell
  public Reveal(): boolean {
    this.isRevealed = true;

    if (!this.containsMine) {
      return false;
    } else return true;
  }
}

class Board {
  game: HTMLElement;
  mineCount: number;
  cells: Cell[];
  rowCount: number;
  columnCount: number;

  constructor(
    game: HTMLElement,
    mineCount: number,
    rowCount: number,
    columnCount: number
  ) {
    this.game = game;
    this.mineCount = mineCount;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.cells = [];

    var maxMines: number = rowCount * columnCount;
    if (mineCount > maxMines) mineCount = maxMines;

    let minesLeft = mineCount;

    for (var i = 0; i < rowCount; i++) {
      for (var j = 0; j < columnCount; j++) {
        this.cells.push(new Cell(false, i, j));
      }
    }

    // throw mines on board!
    while (minesLeft > 0) {
      let randomRow = randomNumber(0, rowCount - 1);
      let randomCol = randomNumber(0, columnCount - 1);
      var randomCell = this.GetCell(randomRow, randomCol);

      if (!randomCell.containsMine) {
        randomCell.containsMine = true;
        minesLeft--;
      }
    }

    // set number of mines surrounding each cells
    for (var i = 0; i < rowCount; i++) {
      for (var j = 0; j < columnCount; j++) {
        let currentCell: Cell = this.GetCell(i, j);
        let surrounding: Cell[] = this.GetSurroundingCells(currentCell);

        currentCell.minesSurrounding = this.CountMines(surrounding);
      }
    }
  }

  public GetCell(row: number, column: number): Cell {
    return this.cells.find((c) => c.row === row && c.column === column);
  }

  private ToggleFlag(cell: Cell) {
    if (cell.isRevealed) return;

    let htmlEl = this.FindDiv(cell);
    if (cell.flagged) {
      htmlEl.classList.remove("flag");
      cell.flagged = false;
    } else {
      htmlEl.classList.add("flag");
      cell.flagged = true;
    }
  }

  private RevealCell(cell: Cell, directClick: boolean) {
    // if the cell is flagged, do nothing
    if (cell.flagged) return;

    let htmlEl = this.FindDiv(cell);
    let surroundingCells: Cell[] = this.GetSurroundingCells(cell);

    if (cell.containsMine && directClick) {
      htmlEl.classList.add("touched");
      this.RevealBoard();
    }

    if (cell.isRevealed && directClick) {
      // check if we have as much flags as mines arround clicked cell
      // if so, reveal unflagged cells
      if (
        cell.minesSurrounding > 0 &&
        this.CountFlags(surroundingCells) === cell.minesSurrounding
      ) {
        surroundingCells.forEach((cellArround) => {
          if (!cellArround.isRevealed) this.RevealCell(cellArround, false);
        });
      }
    } else {
      cell.Reveal();
      this.DisplayCell(cell, htmlEl);

      if (cell.minesSurrounding === 0) {
        surroundingCells.forEach((cellArround) => {
          // only direct neighbor
          if (
            cellArround.column === cell.column ||
            cellArround.row === cell.row
          ) {
            if (!cellArround.isRevealed) this.RevealCell(cellArround, false);
          } else {
            if (cellArround.minesSurrounding > 0 && !cellArround.isRevealed)
              this.RevealCell(cellArround, false);
          }
        });
      }
    }
  }

  private DisplayCell(cell: Cell, htmlEl: HTMLElement) {
    if (cell.containsMine) {
      htmlEl.classList.add("mine");
      return;
    }

    if (cell.minesSurrounding === 0) {
      htmlEl.classList.add("empty");
    } else {
      htmlEl.classList.add("ar" + cell.minesSurrounding);
    }
  }

  private GetSurroundingCells(cell: Cell): Cell[] {
    var surroundingCells: Cell[] = [];

    // upper row
    if (cell.row > 0) {
      if (cell.column > 0)
        surroundingCells.push(this.GetCell(cell.row - 1, cell.column - 1));
      surroundingCells.push(this.GetCell(cell.row - 1, cell.column));

      if (cell.column < this.columnCount - 1)
        surroundingCells.push(this.GetCell(cell.row - 1, cell.column + 1));
    }

    // middle row
    if (cell.column > 0)
      surroundingCells.push(this.GetCell(cell.row, cell.column - 1));

    if (cell.column < this.columnCount - 1)
      surroundingCells.push(this.GetCell(cell.row, cell.column + 1));

    // row bellow
    if (cell.row < this.rowCount - 1) {
      if (cell.column > 0)
        surroundingCells.push(this.GetCell(cell.row + 1, cell.column - 1));
      surroundingCells.push(this.GetCell(cell.row + 1, cell.column));

      if (cell.column < this.columnCount - 1)
        surroundingCells.push(this.GetCell(cell.row + 1, cell.column + 1));
    }

    return surroundingCells;
  }

  private CountMines(cells: Cell[]): number {
    var nbMines = 0;

    cells.forEach((cell) => {
      if (cell.containsMine) nbMines++;
    });

    return nbMines;
  }

  private CountFlags(cells: Cell[]): number {
    var nbFlags = 0;

    cells.forEach((cell) => {
      if (cell.flagged) nbFlags++;
    });

    return nbFlags;
  }

  private FindDiv(cell: Cell): HTMLElement {
    var el: Element = undefined;

    var divs = document.getElementsByClassName(
      `r-${cell.row} c-${cell.column}`
    );
    if (divs.length === 1) el = divs.item(0);

    return <HTMLElement>el;
  }

  public Draw() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add("r-" + i);
        cell.classList.add("c-" + j);
        cell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });
        cell.addEventListener("mouseup", (e) => {
          var cellClicked = this.GetCell(i, j);

          if (e.button === 0) {
            this.RevealCell(cellClicked, true);
          } else if (e.button === 2) {
            this.ToggleFlag(cellClicked);
          }
        });
        cell.addEventListener("click", () => {});
        this.game.append(cell);
      }
    }
  }

  public Clear() {
    while (this.game.firstChild) {
      this.game.removeChild(this.game.firstChild);
    }
  }

  public RevealBoard() {
    for (var i = 0; i < this.cells.length; i++) {
      let htmlEl = this.FindDiv(this.cells[i]);
      this.DisplayCell(this.cells[i], htmlEl);
    }
  }
}

function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}
