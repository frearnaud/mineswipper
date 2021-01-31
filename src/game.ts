document.addEventListener("DOMContentLoaded", function () {
  var game = document.getElementById("game");
  var rowInput = <HTMLInputElement>document.getElementById("row_cnt");
  var colInput = <HTMLInputElement>document.getElementById("col_cnt");
  var mineInput = <HTMLInputElement>document.getElementById("mine_cnt");
  var board: Board;
  createBoard();

  document.getElementById("reveal").addEventListener("click", () => {
    board.RevealBoard();
  });

  document.getElementById("reset").addEventListener("click", () => {
    board.Clear();
    createBoard();
  });

  function createBoard() {
    board = new Board(
      game,
      parseInt(mineInput.value),
      parseInt(rowInput.value),
      parseInt(colInput.value)
    );
    board.Draw();
  }
});
