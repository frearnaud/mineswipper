class Cell {
  isRevealed: boolean;
  containsMine: boolean;
  minesSurrounding: number;
  row: number;
  column: number;

  constructor(containsMine: boolean, row: number, column: number) {
    this.isRevealed = false;
    this.containsMine = containsMine;
    this.row = row;
    this.column = column;
    this.minesSurrounding = -1;
  }

  public Reveal(): boolean {
    this.isRevealed = true;

    if (!this.containsMine) {
      return false;
    } else return true;
  }

  private ToString(): string {
    return `[${this.row}, ${this.column}] - containsMine:${this.containsMine}`;
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

    while (minesLeft > 0) {
      let randomRow = randomNumber(0, rowCount - 1);
      let randomCol = randomNumber(0, columnCount - 1);
      var randomCell = this.GetCell(randomRow, randomCol);

      if (!randomCell.containsMine) {
        randomCell.containsMine = true;
        minesLeft--;
      }
    }
  }

  public GetCell(row: number, column: number): Cell {
    return this.cells.find((c) => c.row === row && c.column === column);
  }

  private RevealCell(cell: Cell) {
    if (!cell.isRevealed) {
      let htmlEl = this.FindDiv(cell);
      cell.Reveal();

      if (cell.containsMine) {
        htmlEl.classList.add("mine");
        return;
      }

      var surroundingCells: Cell[] = this.GetSurroundingCells(cell);
      var minesSurrounding = this.CountMines(surroundingCells);

      if (minesSurrounding === 0) {
        htmlEl.classList.add("empty");
        surroundingCells.forEach((cellArround) => {
          this.RevealCell(cellArround);
        });
      } else {
        htmlEl.classList.add("ar" + minesSurrounding);
      }
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
        cell.addEventListener("click", () => {
          var cellClicked = this.GetCell(i, j);
          this.RevealCell(cellClicked);
        });
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
      this.RevealCell(this.cells[i]);
    }
  }
}

function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}
