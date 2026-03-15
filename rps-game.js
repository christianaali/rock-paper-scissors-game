// Select our HTML elements
const rockBtn = document.querySelector('#rock');
const paperBtn = document.querySelector('#paper');
const scissorsBtn = document.querySelector('#scissors');
const roundMsg = document.querySelector('#round-msg');
const humanScoreDisplay = document.querySelector('#human-score');
const computerScoreDisplay = document.querySelector('#computer-score');
const resetBtn = document.querySelector('#reset');
const matchTotalDisplay = document.querySelector('#match-total');

let humanScore = 0;
let computerScore = 0;
let matchHistory = [];

// Making a "brain" for an AI Opponent
let userMoveFrequency = {
    rock: 0,
    paper: 0,
    scissors: 0
};

function getAIComputerChoice() {
    // 1. Find your most played move
    let mostPlayed = 'rock';
    if (userMoveFrequency.paper > userMoveFrequency[mostPlayed]) mostPlayed = 'paper';
    if (userMoveFrequency.scissors > userMoveFrequency[mostPlayed]) mostPlayed = 'scissors';

    // 2. The AI thinks: "User likes [mostPlayed], so I should play..."
    const counters = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock'
    };

    // 3. Learning Curve. Makes it feel more human and less cheat bot iykwim.
    const isSmartMove = Math.random() < 0.8;

    if (isSmartMove && matchHistory.length > 3) {
        console.log("AI is predicting based on your patterns...");
        return counters[mostPlayed];
    } else {
        // Fallback to random if start of game
        const choices = ["rock", "paper", "scissors"];
        return choices[Math.floor(Math.random() * 3)];
    }
}

/*function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * 3)];
}*/

function checkGameOver() {
// Let's say first to 5 wins the game!
if (humanScore === 5 || computerScore === 5) {
    const winner = humanScore === 5 ? "You" : "The Computer";
    roundMsg.textContent = `🎉 Game Over! ${winner} won the match!`;
    
    // Hide game buttons, show reset button
    document.querySelector('.buttons').style.display = 'none';
    document.querySelector('.battle-arena').style.display = 'none';
    resetBtn.style.display = 'inline-block';
    }
}

function updateHistoryUI() {
    const historyList = document.querySelector('#history-list');

    // Get the lastest round
    const lastRound = matchHistory[matchHistory.length - 1];

    // Create a new list item
    const li = document.createElement('li');
    li.textContent = `Round ${lastRound.iteration}: ${lastRound.userMove} vs ${lastRound.computerMove} (${lastRound.outcome})`;

    // Add to the top of list
    historyList.prepend(li);
}

function playRound(humanChoice) {
    userMoveFrequency[humanChoice]++;

    const userDisplay = document.querySelector('#user-display');
    const computerDisplay = document.querySelector('#computer-display');

    const userText = document.querySelector('#user-text');
    const computerText = document.querySelector('#computer-text');

    // 1. Start the animation
    userDisplay.classList.add('shaking');
    computerDisplay.classList.add('shaking');

    userDisplay.textContent = "✊";
    computerDisplay.textContent = "✊";
    roundMsg.textContent = "Rock... Paper... Scissors...";

    // 2. Wait for the animation to finish (500ms)
    setTimeout(() => {
        userDisplay.classList.remove('shaking');
        computerDisplay.classList.remove('shaking');

        // Map the choice to an emoji
        const computerChoice = getAIComputerChoice();
        const emojis = { rock: "🪨", paper: "📄", scissors: "✂️"};
        
        // Reveal BOTH
        userDisplay.textContent = emojis[humanChoice];
        userText.textContent= humanChoice.charAt(0).toUpperCase() + humanChoice.slice(1);
        computerDisplay.textContent = emojis[computerChoice];
        computerText.textContent = computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1);

        // 3. Run switch logic and update scores
        let result = "";

        if (humanChoice === computerChoice) {
            result = "Tie"; // Assign the result
            roundMsg.textContent = "It's a tie!";
            roundMsg.style.color = "black";
        } else {
            switch (humanChoice + "-" + computerChoice) {
                case "rock-scissors":
                case "paper-rock":
                case "scissors-paper":
                    result = "Win"; // Assign the result
                    roundMsg.textContent = `Win! ${humanChoice} beats ${computerChoice}.`;
                    roundMsg.style.color = "#4CAF45"; // Cute Green
                    humanScore++;
                    break;
                default:
                    result = "Loss"; // Assign the result
                    roundMsg.textContent = `Loss! ${computerChoice} beats ${humanChoice}.`;
                    roundMsg.style.color = "#fe6b6b"; // Soft Red
                    computerScore++;
            }
        }

        // 4. Update Score and History
        humanScoreDisplay.textContent = humanScore;
        computerScoreDisplay.textContent = computerScore;

        matchHistory.push({
            iteration: matchHistory.length + 1,
            userMove: humanChoice,
            computerMove: computerChoice,
            outcome: result
        });

        // Calculate Statistics
        const totalGames = matchHistory.length;
        const totalWins = matchHistory.filter(round => round.outcome === "Win").length;
        const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

        // Update UI
        document.querySelector('#win-rate').textContent= `${winRate}%`;
        matchTotalDisplay.textContent = `Total Matches: ${totalGames}`;

        updateHistoryUI();
        checkGameOver();
    }, 500); // This 500 matches the 0.5s in CSS
}

// Add "Event Listeners" (Like ActionListeners in Java)
rockBtn.addEventListener('click', () => playRound('rock'));
paperBtn.addEventListener('click', () => playRound('paper'));
scissorsBtn.addEventListener('click', () => playRound('scissors'));

resetBtn.addEventListener('click', () => {
    humanScore = 0;
    computerScore = 0;
    humanScoreDisplay.textContent = 0;
    computerScoreDisplay.textContent = 0;
    roundMsg.textContent = "Choose your weapon to start!";
    document.querySelector('.buttons').style.display = 'block';
    resetBtn.style.display = 'none';
    roundMsg.style.color = 'black'; // Reset color
    matchHistory = [];
    document.querySelector('#history-list').innerHTML = ''; // Clears UI list
    document.querySelector('.battle-arena').style.display = 'flex';
    document.querySelector('#win-rate').textContent = '0%';
    matchTotalDisplay.textContent = `Total Matches: 0`;
});
