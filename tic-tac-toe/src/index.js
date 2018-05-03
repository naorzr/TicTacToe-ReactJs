import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {


  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={this.props.winner ? this.props.winner.winningSquares[i] &&{fontWeight: 'bold',color: 'green'} : {}}
      />
    );
  }

  generateCells(rowNum, colNum) {
      var cells = Array(colNum).fill(null);
      return cells.map((value, index) => {
        return this.renderSquare(index + rowNum*3)
      });
  }

    generateRows(rowNum,colNum) {
      var rows = Array(rowNum).fill(null);

      return rows.map((value, index) => {
        return (
          <div key ={index} className="board-row">
            {this.generateCells(index,colNum)}
          </div>
        )
      });

  }

  render() {
    return (
      <div>
        {this.generateRows(3,3)}
      </div>
    );
  }
}

class Game extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      ascend: true,
      history: {
        squaresHistory: [{
        squares: Array(9).fill(null)
      }],
      rowCol: [],
    },
      stepNumber: 0,
      xIsNext: true,
      moves: [],
    };
  }

  handleClick(i) {
     const history = this.state.history.squaresHistory.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const locHistory = this.state.history.rowCol.slice();



    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: {
        squaresHistory: history.concat(
        [{
        squares: squares
      }]),
      rowCol: locHistory.concat(`Row ${Math.floor(i/3)} Col ${i%3}`)
    },
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
   this.setState({
     stepNumber: step,
     xIsNext: (step % 2) === 0,
   });

 }




  render() {
    const history = this.state.history.squaresHistory;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let winnerHighLight = {};
    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
      winnerHighLight = {fontWeight: 'bold',color: 'red'};
    } else {
      if(this.state.stepNumber == 9){
        status = "It's a Draw"
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    var moves = history.map((step, move) => {
         const desc = move ?
           'Go to move ' + move + " # # " + this.state.history.rowCol[move-1] :
           'Go to game start';

             return (
               <div key={move-1}>
               <li move-data={move}>
                 {this.state.stepNumber === move && <a style={{fontWeight: 'bold',color: 'green',cursor: 'pointer'}} onClick={() => this.jumpTo(move)}>{desc}</a>}
                 {this.state.stepNumber !== move && <a style={{cursor: 'pointer'}} onClick={() => this.jumpTo(move)}>{desc}</a>}
               </li>
             </div>
             );
           }
     );
     
     console.log(moves[0]);
     if(!this.state.ascend){
       moves.sort((a,b) => b.key-a.key);
     }

     console.log(current.squares);

    return (

      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ascend: !this.state.ascend})}>{this.state.ascend?"Ascending":"Descending"}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winningSquares: lines[i]};
    }
  }
  return null;
}
