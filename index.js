const boardElement = document.getElementById('board')
const messageElement = document.getElementById('message')
const resetButton = document.getElementById('resetButton')
const cells = Array.from(document.querySelectorAll('.cell'))

let board = ['', '', '', '', '', '', '', '', '']
let currentPlayer = 'X'
let isGameActive = true

const winningConditions = [
 [0, 1, 2],
 [3, 4, 5],
 [6, 7, 8],
 [0, 3, 6],
 [1, 4, 7],
 [2, 5, 8],
 [0, 4, 8],
 [2, 4, 6],
]

function handleCellClick(event) {
 const cell = event.target
 const cellIndex = cell.getAttribute('data-index')

 if (board[cellIndex] !== '' || !isGameActive) {
  return
 }

 updateCell(cell, cellIndex)
 checkForWinner()

 if (isGameActive) {
  setTimeout(computerMove, 500)
 }
}

function updateCell(cell, index) {
 board[index] = currentPlayer
 cell.textContent = currentPlayer
 cell.classList.add('disabled')
}

function checkForWinner() {
 let roundWon = false

 for (let i = 0; i < winningConditions.length; i++) {
  const winCondition = winningConditions[i]
  const a = board[winCondition[0]]
  const b = board[winCondition[1]]
  const c = board[winCondition[2]]

  if (a === '' || b === '' || c === '') {
   continue
  }

  if (a === b && b === c) {
   roundWon = true
   break
  }
 }

 if (roundWon) {
  isGameActive = false
  messageElement.textContent = `Player ${currentPlayer} has won!`
  return
 }

 if (!board.includes('')) {
  isGameActive = false
  messageElement.textContent = `Game is a draw!`
  return
 }

 currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
}

function computerMove() {
 let bestMove = -Infinity
 let move

 for (let i = 0; i < board.length; i++) {
  if (board[i] === '') {
   board[i] = 'O'
   let score = minimax(board, 0, false)
   board[i] = ''
   if (score > bestMove) {
    bestMove = score
    move = i
   }
  }
 }

 if (move !== undefined) {
  const cell = cells[move]
  updateCell(cell, move)
  checkForWinner()
 }
}

function minimax(newBoard, depth, isMaximizing) {
 const scores = {
  X: -10,
  O: 10,
  tie: 0,
 }

 let result = checkWinner(newBoard)
 if (result !== null) {
  return scores[result]
 }

 if (isMaximizing) {
  let bestScore = -Infinity
  for (let i = 0; i < newBoard.length; i++) {
   if (newBoard[i] === '') {
    newBoard[i] = 'O'
    let score = minimax(newBoard, depth + 1, false)
    newBoard[i] = ''
    bestScore = Math.max(score, bestScore)
   }
  }
  return bestScore
 } else {
  let bestScore = Infinity
  for (let i = 0; i < newBoard.length; i++) {
   if (newBoard[i] === '') {
    newBoard[i] = 'X'
    let score = minimax(newBoard, depth + 1, true)
    newBoard[i] = ''
    bestScore = Math.min(score, bestScore)
   }
  }
  return bestScore
 }
}

function checkWinner(board) {
 for (let i = 0; i < winningConditions.length; i++) {
  const [a, b, c] = winningConditions[i]
  if (board[a] && board[a] === board[b] && board[a] === board[c]) {
   return board[a]
  }
 }

 if (!board.includes('')) {
  return 'tie'
 }
 return null
}

function resetGame() {
 board = ['', '', '', '', '', '', '', '', '']
 isGameActive = true
 currentPlayer = 'X'
 messageElement.textContent = ''
 cells.forEach((cell) => {
  cell.textContent = ''
  cell.classList.remove('disabled')
 })
}

cells.forEach((cell) => {
 cell.addEventListener('click', handleCellClick)
})

resetButton.addEventListener('click', resetGame)

resetGame()
