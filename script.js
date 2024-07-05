class Records { 
    static userMatchPointTracker = [21]; 
    static scoreHistory = []
} 

const gameLists = new Records(); 

/**
 * This function gives a player a point
 * @param {*} player The player to recieve a point
 */
function addScore(player) {
    const score = document.getElementById(`score${player}`);
    let num = Number(score.textContent);
    score.textContent = num + 1;
    if (checkWin(player, num + 1)) {
        // If the game is won, handle the win
    } else if (num + 1 >= Records.userMatchPointTracker[0]) {
        alert('Please start a new game.');
    } else {
        Records.scoreHistory.push({ player: player, score: num + 1 });
    }
}

/**
 * This function changes a player's name
 */
function changePlayerName() { 
    const userChoice = prompt('Left side (1) or Right side (2)?:'); 

    if (userChoice != 1 && userChoice != 2) { 
        alert('Invalid entry.')
    } else {
        let leftPlayer = document.querySelector('.player.left');
        let rightPlayer = document.querySelector('.player.right');
        
        const newName = prompt('Enter name:'); 

        if (!newName) { 
            alert('Invalid name.')
        } else { 
            if (userChoice == 1) { 
                leftPlayer.querySelector('h2').textContent = newName;
            } else if (userChoice == 2) { 
                rightPlayer.querySelector('h2').textContent = newName;
            } else { 
                alert('Error.')
            }
        }
    }
} 

/** 
 * This function resets the score
 */
function resetScore() {
    document.getElementById('score1').textContent = '0';
    document.getElementById('score2').textContent = '0';
}

/**
 * This function undoes the score history
 */
function undoScore() {
    if (Records.scoreHistory.length > 0) { 
        const lastAction = Records.scoreHistory.pop(); 
        const score = document.getElementById(`score${lastAction.player}`);
        score.textContent = lastAction.score;
    } else { 
        alert('No actions to undo.')
    }
}

/**
 * This functions queries the user and gets match point information
 */
function matchPoint() { 
    const userMatchPoint = prompt('Enter match point:');
    let num = Number(userMatchPoint);
    if (Number.isInteger(num) && num <= 21) { 
        document.querySelector('#matchPointValue').textContent = num;

        while (Records.userMatchPointTracker.length > 0) { 
            Records.userMatchPointTracker.pop();
        } 

        Records.userMatchPointTracker.push(num);
    } else { 
        alert('Invalid entry.')
    } 
}

/**
 * This function displays a temporary message
 * @param {*} message 
 * @param {*} duration 
 */
function showTemporaryMessage(message, duration) { 
    const messageDiv = document.createElement('div'); 
    messageDiv.textContent = message; 

    // Styling for visibility
    Object.assign(messageDiv.style, { 
        position: 'fixed', 
        top: '50%' , 
        left: '50%' , 
        transform: 'translate(-50%, -50%)' , 
        backgroundColor: 'rgba(0, 0, 0,.7)' , 
        color: 'white' , 
        padding: '20px' , 
        zIndex: 1000 , 
        textAlign: 'center' , 
        borderRadius: '10px' , 
        fontSize: '2em', 
    }); 

    document.body.appendChild(messageDiv);

    setTimeout(() => { 
        document.body.removeChild(messageDiv); 
    }, duration);
}

/**
 * This function checks for score updates and displays messages when necessary
 * @param {*} playerId 
 * @param {*} playerScore 
 * @returns This function returns a boolean value
 */
function checkWin(playerId, playerScore) { 
    if (Records.userMatchPointTracker.length != 0) { 
        gamePoint = Records.userMatchPointTracker[0];
    }
    
    if (playerScore + 1 == gamePoint) {
        showTemporaryMessage('Game Point!', 2000);
        return false;
    } else if (playerScore == gamePoint) { 
        if (playerId == 1) { 
            playerName = document.querySelector('.player.left');
        }  else { 
            playerName = document.querySelector('.player.right'); 
        }
        
        let name = playerName.querySelector('h2').textContent

        showTemporaryMessage(`${name} Wins!`, 10000);

        return true; 
    } else { 
        return false;
    }
}