class Deck{
    static cards =[
        {cost: 0, type: 'damage', value: 2, name: 'Quick Strike', cardNum: 1}, 
        {cost: 1, type: 'damage', value: 6, name: 'Flame- thrower', cardNum: 2}, 
        {cost: 1, type: 'damage', value: 6, name: 'Flame- thrower', cardNum: 3}, 
        {cost: 1, type: 'defense', value: 4, name: 'Defenses up!', cardNum: 4}, 
        {cost: 1, type: 'defense', value: 4, name: 'Defenses up!', cardNum: 5}, 
        {cost: 2, type: 'defense', value: 10, name: 'Daring Escape', cardNum: 6}
    ];

    static discard = [];
    static hand = [];
}

class Entities{
    static player = {health: 30, cardPlay: 3, guard: 0}
    static bugling = {health: 50, damage: 4, guard: 0}
}


CreateBattleUI(1);
DrawInitialHand();
resizeGame();
window.addEventListener('resize', resizeGame);
window.addEventListener('resize', setCardSize);


DisplayCards();
fight1();


async function fight1() {
    const enemyWarning = document.getElementById("eW");
    const enemyHealthHTML = document.getElementById("eHP")
    const playerHealthHTML = document.getElementById("pHP");
    const cardPlayHTML = document.getElementById("energyLeft");
    const playerGuardHTML = document.getElementById("pGuard");

    while (Entities.bugling.health > 0 && Entities.player.health > 0) {
        await PlayerTurn();

        Entities.player.cardPlay = 3;
        cardPlayHTML.innerHTML = "energy: " + Entities.player.cardPlay;
        
        if (Entities.bugling.health > 0) {

            enemyWarning.style.fontSize = '30px';

            enemyWarning.innerHTML = `Bugman attacks for ${Entities.bugling.damage} damage!`;

            await new Promise(resolve => setTimeout(resolve, 1000));

            enemyWarning.style.fontSize = '60px';

            enemyWarning.innerHTML = "dw: " + (Entities.bugling.damage + 1);


            const damageToTake = Math.max(Entities.bugling.damage - Entities.player.guard, 0);
            Entities.player.health -= damageToTake;
            playerHealthHTML.innerHTML = "hp: " + Entities.player.health;
        }

        // Reset player guard and update UI
        Entities.player.guard = 0;
        playerGuardHTML.innerHTML = "guard: " + Entities.player.guard;

        if (Entities.player.health <= 0) {
            showDeathScreen();  // Show the "You Died" screen
            break;  // Stop the fight
        }

        let damageModifier = Math.floor(Math.random() * 2);
        console.log(damageModifier)
        if (damageModifier == 0){
            Entities.bugling.damage += 1;
        } else {
            Entities.bugling.damage += 2;
        }
    }

    if (Entities.bugling.health <= 0) {
        enemyHealthHTML.innerHTML = '';

        enemyWarning.innerHTML = "Bugman defeated!";
    }
}







function PlayerTurn() {
    resetCardListeners(); // Always reset listeners for the current hand

    return new Promise((resolve) => {
        const endTurnButton = document.getElementById("endBtn");
        endTurnButton.removeEventListener("click", resolve); // Clear previous listeners
        endTurnButton.addEventListener("click", () => {
            resolve(); // Resolve the promise when the button is clicked
            refillHand(); // Refill the hand after the turn ends
        }, { once: true });
    });
}



function resetCardListeners() {
    // Select all current cards in the player's hand
    const playerCards = Array.from(document.querySelectorAll('#playerHand .deckCard'));

    // Clear previous event listeners and add new ones
    playerCards.forEach((card, index) => {
        // Clear previous listeners
        card.removeEventListener("click", () => {}); // This won't work since we didn't save the function reference.

        // Add a new event listener
        card.addEventListener("click", () => {
            if (Deck.hand[index] && Deck.hand[index].cost <= Entities.player.cardPlay) {
                CardHandler(index);
            } else {
                console.log("Not enough card plays or card does not exist.");
            }
        });
    });
}


function CreateBattleUI(floor){

    if (floor === 1){
        
        const gameScreen = document.getElementById("game")

        const levelHeader = document.createElement("div");
        const floorNum = document.createElement("h2");

        const enemyContainer = document.createElement("div");
        const enemyImg = document.createElement("img");
        const enemyHealth = document.createElement("h2");
        const damageWarning = document.createElement("h2");

        const playerContainer = document.createElement("div");
        const playerImg = document.createElement("img");
        const playerHealth = document.createElement("h3");
        const playerGuard =  document.createElement("h3");
        const cardPlaysLeft = document.createElement("h3");
        const endTurnBtn = document.createElement("button");

        const deckContainer = document.createElement("div");
        const playerHand = document.createElement("div");
        const handAndInfoContainer = document.createElement("div");

        const numCollumn = document.createElement("div");
        const row1 = document.createElement("div");
        const row2 = document.createElement("div");
        const row3 = document.createElement("div");
        const padding = document.createElement("div");




        levelHeader.setAttribute("class", "col-12 floorBanner");
        enemyContainer.setAttribute("class", "col-12 enemyContainer");
        enemyHealth.setAttribute("id", "eHP")
        damageWarning.setAttribute("id", "eW")
        enemyHealth.setAttribute("class", "eText")
        damageWarning.setAttribute("class", "eText")
        enemyImg.setAttribute("src", "assetsPH/realbugmam.png")
        enemyImg.setAttribute("class", "enemyImg")
        numCollumn.setAttribute("class", "col-2")
        playerContainer.setAttribute("class", "col-12 playerContainer")
        playerImg.setAttribute("src", "assetsPH/player.png")
        deckContainer.setAttribute("class", "col-2 deckContainer")
        cardPlaysLeft.setAttribute("id", "energyLeft")
        endTurnBtn.setAttribute("id", "endBtn")
        playerHealth.setAttribute("id", "pHP")
        playerGuard.setAttribute("id", "pGuard")
        playerHand.setAttribute("class", "col-10")
        playerHand.setAttribute("id", "playerHand")
        handAndInfoContainer.setAttribute("class", "handAndInfoContainer col-12")

        row1.setAttribute("class", "row");
        row2.setAttribute("class", "row");
        row3.setAttribute("class", "row");
        padding.setAttribute("class", "col-4")




        floorNum.textContent = floor;
        enemyHealth.textContent = "hp: " + Entities.bugling.health;
        damageWarning.textContent = "dw: " + Entities.bugling.damage;
        playerHealth.textContent = "hp: " + Entities.player.health;
        playerGuard.textContent = "guard: " + Entities.player.guard;
        cardPlaysLeft.textContent = "energy: " + Entities.player.cardPlay;
        endTurnBtn.textContent = "End Turn"



        levelHeader.appendChild(floorNum)
        row1.appendChild(levelHeader)
        gameScreen.appendChild(row1)

        enemyContainer.appendChild(enemyImg)
        numCollumn.appendChild(enemyHealth)
        numCollumn.appendChild(damageWarning)
        row2.appendChild(padding)
        row2.appendChild(numCollumn)
        row2.appendChild(enemyContainer)
        gameScreen.appendChild(row2)

        deckContainer.appendChild(playerHealth);
        deckContainer.appendChild(cardPlaysLeft);
        deckContainer.appendChild(playerGuard);
        deckContainer.appendChild(endTurnBtn);
        handAndInfoContainer.appendChild(deckContainer);
        handAndInfoContainer.appendChild(playerHand)
        row3.appendChild(handAndInfoContainer);
        gameScreen.appendChild(row3);


    }

}

function resizeGame() {
    const gameScreen = document.getElementById("game");
    const gameWidth = window.innerWidth * 0.9;
    const gameHeight = window.innerHeight * 0.9;

    gameScreen.style.width = `${gameWidth}px`;
    gameScreen.style.height = `${gameHeight}px`;


    const enemyImg = document.querySelector(".enemyImg");

    enemyImg.style.height = `${gameHeight * 0.50}px`;


    // Resize cards in the player's hand
    const cards = document.querySelectorAll(".deckCard");
    const cardWidth = Math.min(gameWidth * 0.15, 160);  // Limit card width to a max of 160px
    const cardHeight = Math.min(gameHeight * 0.2, 250); // Limit height to a max of 250px

    cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    });
}

function setCardSize() {
    const cards = document.querySelectorAll('.deckCard');
    cards.forEach(card => {
        card.style.width = '200px';  // Reset width
        card.style.height = '250px'; // Reset height
    });
}

function DrawInitialHand() {
    Deck.hand = [];

    // Draw 5 cards into the hand
    for (let i = 0; i < 5; i++) {
        MoveToHand(0); // Move the top card from deck to hand
    }
}

//Creates cards, takes info from Deck class, and puts it onto the cards
function DisplayCards() {
    const playerHandDiv = document.getElementById('playerHand');
    playerHandDiv.innerHTML = ''; // Clear previous cards

    // Loop through the current hand and display each card
    Deck.hand.forEach((cardData, index) => {
        const card = document.createElement("div");
        const value = document.createElement("h4");
        const cost = document.createElement("h4");
        const cardName = document.createElement("h5");

        card.setAttribute("class", "col-2 deckCard");
        card.setAttribute("id", `card${index}`); // Update card ID dynamically

        value.setAttribute("class", "value");
        cost.setAttribute("class", "cost");

        // Set the content of the card
        value.textContent = cardData.value;
        cost.textContent = cardData.cost;
        cardName.textContent = cardData.name;

        // Append the card details to the card element
        card.appendChild(cost);
        card.appendChild(cardName);
        card.appendChild(value);

        // Append the card to the player's hand
        playerHandDiv.appendChild(card);
    });
}


function CardHandler(i) {
    const enemyHealthHTML = document.getElementById("eHP");
    const cardPlayHTML = document.getElementById("energyLeft");
    const playerGuardHTML = document.getElementById("pGuard");

    if (Deck.hand[i]) {
        if (Deck.hand[i].type === 'damage') {
            Entities.bugling.health -= Deck.hand[i].value;
            enemyHealthHTML.innerHTML = "hp: " + Entities.bugling.health;
        } else if (Deck.hand[i].type === 'defense') {
            Entities.player.guard += Deck.hand[i].value;
            playerGuardHTML.innerHTML = "guard: " + Entities.player.guard;
        }

        Entities.player.cardPlay -= Deck.hand[i].cost; // Reduce card play count
        cardPlayHTML.innerHTML = "energy: " + Entities.player.cardPlay;

        // Move the used card to the discard pile and remove it from hand
        Deck.discard.push(Deck.hand[i]);
        Deck.hand.splice(i, 1);

        // Re-render the hand and re-attach the listeners
        DisplayCards();
        resetCardListeners();
    } else {
        console.log("Card not found in hand.");
    }
}

function refillHand() {
    // Check how many cards you currently have in hand
    const currentHandSize = Deck.hand.length;

    // First, fill from deck
    while (Deck.hand.length < 5 && Deck.cards.length > 0) {
        const card = Deck.cards.shift(); // Take the top card from the deck
        Deck.hand.push(card); // Add it to the hand
    }

    // If we still have space, fill from discard
    while (Deck.hand.length < 5 && Deck.discard.length > 0) {
        const card = Deck.discard.shift(); // Take the top card from the discard pile
        Deck.hand.push(card); // Add it to the hand
    }

    DisplayCards();
}


function MoveToHand(i){
    
    const placeHolderCard = Deck.cards[i];
    Deck.cards.splice(i, 1);
    Deck.hand.push(placeHolderCard);
        
}

// Reset health and state when needed
function resetGame() {
    Entities.player.health = 30;
    Entities.bugling.health = 25;
    Entities.player.cardPlay = 3;

}

function showDeathScreen() {
    // Create the death screen container
    const deathScreen = document.createElement('div');
    deathScreen.classList.add('youDiedScreen');
    
    // Add the "You Died" text
    const deathText = document.createElement('h1');
    deathText.innerText = "You Died...";
    deathScreen.appendChild(deathText);
    
    // Append the death screen to the body
    document.body.appendChild(deathScreen);
    
    // Wait for the fade animation before showing the text
    setTimeout(() => {
      deathScreen.classList.add('showText');
    }, 3000); // Delay for 3 seconds to match the fade animation time
}