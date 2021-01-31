document.addEventListener("DOMContentLoaded", function () {
  var game = document.getElementById("game");
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
    board = new Board(game, 60, 20, 20);
    board.Draw();
  }
});
