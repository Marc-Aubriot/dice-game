let gameInstance;

// bouton newGame initilise la partie
function newGame() {
    if ( gameInstance !== undefined ) {
        gameInstance = new Game();
        gameInstance.updateUi();
        console.log("nouvelle partie");
        return;
    };
    gameInstance = new Game();
    gameInstance.updateUi();
    if (gameInstance.debug) { 
        console.log(gameInstance);
        console.log(`Début de partie, tour du joueur : ${gameInstance.playerTurn}`); 
    };
};

// bouton rollDice, ajoute les points gagnés au points du round, ou switch de joueur
function rollDice() {
    if ( gameInstance === undefined ) { 
        console.log('Pas de partie en cours');    
        return; 
    };
    if ( gameInstance.playerWin !== 0 ) {
        console.log('la partie est finie, il faut lancer une nouvelle partie');
        return;
    };

    gameInstance.diceRoll();
    gameInstance.rollCheck();
    gameInstance.updateUi();

    // dice roll animation
    const dice = document.getElementById('diceImage');
    dice.classList = 'middleDiceBox mx-auto shadow rotateDice';
    setTimeout(() => {
        dice.classList = 'middleDiceBox mx-auto shadow';
    }, 200);
};

// bouton holdDice, garde les points gagnés et les ajoute aux points "global"
function holdDice() {
    if ( gameInstance === undefined ) {
        console.log('Pas de partie en cours');
        return;
    };
    if ( gameInstance.playerWin !== 0 ) {
        console.log('la partie est finie, il faut lancer une nouvelle partie');
        return;
    };

    gameInstance.holdTurn();
    gameInstance.updateUi();
};

// game logic and variables
class Game {
    constructor() {
        this.playerOneRoundPoint = 0
        this.playerTwoRoundPoint = 0
        this.playerOneGlobalPoint = 0
        this.playerTwoGlobalPoint = 0
        this.roll = 1 
        this.playerTurn = 1
        this.playerWin = 0
        this.debug = true

        // this.roll = random number between 1 and 6
        this.diceRoll = function() { 
            this.roll = Math.round((Math.random() * 5 ) + 1 );
            if (this.debug) { console.log(`diceRoll: ${this.roll}`); }
        };

        // if roll = 1, switch player else add roll to current round point
        this.rollCheck = function() {
            if ( this.roll === 1 && this.playerTurn === 1 ) {
                this.playerTurn = 2;
                this.playerOneRoundPoint = 0;
                console.log('ROLL 1, au tour du joueur 2');
                return;
            } else if ( this.roll === 1 && this.playerTurn === 2 ) {
                this.playerTurn = 1;
                this.playerTwoRoundPoint = 0;
                console.log('ROLL 1, au tour du joueur 1');
                return;
            } else if ( this.roll === 1 && this.playerTurn === undefined ){
                console.log('error: game active but no player');
                return;
            };
        
            if ( this.playerTurn === 1 ) {
                this.playerOneRoundPoint = this.playerOneRoundPoint + this.roll;
                if (this.debug) { 
                    console.log(`Player 1 Round points: ${this.playerOneRoundPoint}`); 
                };
            
            } else if ( this.playerTurn === 2 ) {
                this.playerTwoRoundPoint = this.playerTwoRoundPoint + this.roll;
                if (this.debug) { 
                    console.log(`Player 2 Round points: ${this.playerTwoRoundPoint}`);
                };
            
            } else {
                if (this.debug) { console.log('No game active'); };
            };
        };

        // keep the current round point; add round point to global, then switch player
        this.holdTurn = function() {
            if ( this.playerTurn === 1 ) {
                this.playerOneGlobalPoint = this.playerOneGlobalPoint + this.playerOneRoundPoint;
                this.playerOneRoundPoint = 0;
                this.checkWin();
                this.playerTurn = 2;
                if (this.debug) {
                    console.log(`New Global for player 1 = ${this.playerOneGlobalPoint}`);
                };
                return;
            } else {
                this.playerTwoGlobalPoint = this.playerTwoGlobalPoint + this.playerTwoRoundPoint;
                this.playerTwoRoundPoint = 0;
                this.checkWin();
                this.playerTurn = 1;
                if (this.debug) {
                    console.log(`New Global for player 2 = ${this.playerTwoGlobalPoint}`);
                };
                return;
            };
        };

        // if global >= 100 pts, then active player win
        this.checkWin = function() {
            if ( this.playerTurn === 1 && this.playerOneGlobalPoint >= 100 ) {
                this.playerWin = 1;
            } else if ( this.playerTurn === 2 && this.playerTwoGlobalPoint >= 100 ) {
                this.playerWin = 2;
            } else {
                if (this.debug) {
                    console.log('no victory');
                };
                return;
            };
        };

        // update ui
        this.updateUi = function() {
            const diceImage = document.getElementById('diceImage');
            const globalP1 = document.getElementById('playerOneGlobalPoint');
            const globalP2 = document.getElementById('playerTwoGlobalPoint');
            const roundP1 = document.getElementById('playerOneRoundPoint');
            const roundP2 = document.getElementById('playerTwoRoundPoint');
            const boardP1 = document.getElementById('playerOneBoard');
            const boardP2 = document.getElementById('playerTwoBoard');
            const nameP1 = document.getElementById('playerNameOne');
            const nameP2 = document.getElementById('playerNameTwo');
            const dotP1 = document.getElementById('playerOneDot');
            const dotP2 = document.getElementById('playerTwoDot');
        
            // dice and player points update
            diceImage.src = `/images/dice-${this.roll}.png`;
            globalP1.textContent = `${this.playerOneGlobalPoint}`;
            globalP2.textContent = `${this.playerTwoGlobalPoint}`;
            roundP1.textContent = `${this.playerOneRoundPoint}`;
            roundP2.textContent = `${this.playerTwoRoundPoint}`;
        
            // background color and name weight change for active player
            if ( this.playerTurn === 1 ) {
                boardP1.style = 'background-color: rgb(233, 233, 233);';
                nameP1.style = 'font-weight: bold;';
                dotP1.style = 'visibility: visible;';
                boardP2.style = 'background-color: white;';
                nameP2.style = 'font-weight: none;';
                dotP2.style = 'visibility: hidden;';
            } else if ( this. playerTurn === 2 ) {
                boardP1.style = 'background-color: white;';
                nameP1.style = 'font-weight: none;';
                dotP1.style = 'visibility: hidden;';
                boardP2.style = 'background-color: rgb(233, 233, 233);';
                nameP2.style = 'font-weight: bold;';
                dotP2.style = 'visibility: visible;';
            };

            // win update
            if ( this.playerWin === 1 ) {
                globalP1.textContent = `Victoire !`;
            } else if ( this.playerWin === 2 ) {
                globalP2.textContent = `Victoire !`;
            };
        };
    };
};

newGame();