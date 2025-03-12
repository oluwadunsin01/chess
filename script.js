// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // initialize the chess board
    const game = new Chess(); // create new js chess game
    const moveHistory = document.getElementById('move-history'); // get the move history element
    let movecount = 1; // initialize move count
    let usercolor = 'w'; // initialize user color

    const makeRandomMove = () => {
        const possibleMoves = game.moves();
       
        if(game.game_over() === true){
            alert("Checkmate!");
            
        }else{
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIndex];
            game.move(move);
            board.position(game.fen());
            recordmove(move, movecount);
            movecount++;

        }
    }
    const recordmove = (move, count) => {
        const formattedmove = count % 2 === 1 ? `${Math.ceil
            (count / 2)}. ${move}` : `${Math.ceil(count / 2)}. ... ${move}`;
        moveHistory.textContent += formattedmove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;

 };
    const onDragStart = (source, piece) => {
       return !game.game_over() && piece.search(usercolor) === 0;

        };
    
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });
        if (move === null) {
            return 'snapback';
        }
        recordmove(move.san, movecount);
        movecount++;
        window.setTimeout(makeRandomMove, 250);
    };
    const onSnapEnd = () => {
        board.position(game.fen());
    };
    const boardConfig = {
      shownotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        movespeed: 'fast',
        snapbackspeed: '500',
        snapSpeed: '100',
    };
        board = Chessboard('board', boardConfig);


        document.querySelector('.play-again').addEventListener('click', () => {
            game.reset();
            board.start();
            moveHistory.textContent = '';
            movecount = 1;
            usercolor = 'w';
        });
        document.querySelector('.set-pos').addEventListener('click', () => {
            const fen = prompt('Enter the FEN notation for the position you want to set:');
            if (fen !== null) {
              if(game.load(fen)){
                board.position(fen);
                moveHistory.textContent = '';
                movecount = 1;
                usercolor = 'w';
            }else{
                alert('Invalid FEN please try again');
            }
        }
    });
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        usercolor = usercolor === 'w' ? 'b' : 'w';
    });
}); 
