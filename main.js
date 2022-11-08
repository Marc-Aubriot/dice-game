// import here
let gameInstance;

// bouton newGame initilise la partie
function newGame() {
    if ( gameInstance !== undefined ) {
        gameInstance = new Game();
        updateUi();
        console.log("nouvelle partie");
        return;
    };
    gameInstance = new Game();
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

    gameInstance.diceRoll();
    gameInstance.rollCheck();
    updateUi();
};

// bouton holdDice, garde les points gagnés et les ajoute aux points "global"
function holdDice() {
    if ( gameInstance === undefined ) {
        console.log('Pas de partie en cours');
        return;
    };

    gameInstance.holdTurn();
    updateUi();
};

// update the players ui and dice
function updateUi() {
    const diceImage = document.getElementById('diceImage');
    const globalP1 = document.getElementById('playerOneGlobalPoint');
    const globalP2 = document.getElementById('playerTwoGlobalPoint');
    const roundP1 = document.getElementById('playerOneRoundPoint');
    const roundP2 = document.getElementById('playerTwoRoundPoint');

    diceImage.src = `/images/dice-${gameInstance.roll}.png`;
    globalP1.textContent = `${gameInstance.playerOneGlobalPoint}`;
    globalP2.textContent = `${gameInstance.playerTwoGlobalPoint}`;
    roundP1.textContent = `${gameInstance.playerOneRoundPoint}`;
    roundP2.textContent = `${gameInstance.playerTwoRoundPoint}`;

    if ( gameInstance.playerWin === 1 ) {
        globalP1.textContent = `Victoire !`;
    } else if ( gameInstance.playerWin === 2 ) {
        globalP2.textContent = `Victoire !`;
    };
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
            } else if ( this.playerTurn === 2 && this.playerTwoRoundPoint >= 100 ) {
                this.playerWin = 2;
            } else {
                if (this.debug) {
                    console.log('no victory');
                };
                return;
            };
        };
    };
};