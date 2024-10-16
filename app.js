class Deck{
    static cards =[
        {cost: 0, type: 'attack', value: 2, name: 'Quick Strike', cardNum: 1, asset: 'assetsPH/attack.png'}, 
        {cost: 1, type: 'attack', value: 6, name: 'Flame- thrower', cardNum: 2, asset: 'assetsPH/attack.png'}, 
        {cost: 1, type: 'attack', value: 6, name: 'Flame- thrower', cardNum: 3, asset: 'assetsPH/attack.png'}, 
        {cost: 1, type: 'defense', value: 6, name: 'Defenses up!', cardNum: 4, asset: 'assetsPH/defense.png'}, 
        {cost: 1, type: 'defense', value: 6, name: 'Defenses up!', cardNum: 5, asset: 'assetsPH/defense.png'},
        {cost: 0, type: 'defense', value: 4, name: 'Dodge Roll', cardNum: 6, asset: 'assetsPH/defense.png'}, 
        {cost: 2, type: 'defense', value: 14, name: 'Daring Escape', cardNum: 7, asset: 'assetsPH/defense.png'},
        {cost: 1, type: 'poison', value: 4, name: 'Toxic Splash', cardNum: 8, asset: 'assetsPH/poison.png'},
        {cost: 2, type: 'poison', value: 8, name: 'Acid Bath', cardNum: 9, asset: 'assetsPH/poison.png'},
        {cost: 1, type: 'energy', value: 1, name: 'Deep Breath', cardNum: 10, asset: 'assetsPH/energy.png'},
    ];

    static discard = [];
    static hand = [];
}

class Entities{
    static player = {health: 40, cardPlay: 3, guard: 0, poison: 0, nextTurnExtraCardPlayxtraCardPlay: false, turn: 1}
    static bugling = {health: 150, damage: 4, guard: 0, poison: 0}
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
    const playerTurn = document.getElementById("turnNumber");
    

    while (Entities.bugling.health > 0 && Entities.player.health > 0) {
        await PlayerTurn();

        if (Entities.player.nextTurnExtraCardPlay) {
            Entities.player.cardPlay = 4; // Apply extra card play for this turn
            Entities.player.nextTurnExtraCardPlay = false; // Reset for the following turn
        } else {
            Entities.player.cardPlay = 3; // Reset to 3 card plays after the extra turn
        }

        if (Entities.bugling.poison > 0) {
            const poisonDamage = Entities.bugling.poison;
            Entities.bugling.health -= poisonDamage;
            enemyHealthHTML.innerHTML = `<img src='assetsPH/bHeart.png' class='coolIcon' alt='HP'>: ${Entities.bugling.health}`;

            enemyWarning.style.fontSize = '30px';

            enemyWarning.innerHTML = `Bugman takes ${poisonDamage} poison damage!`;
            await new Promise(resolve => setTimeout(resolve, 1000));

            enemyWarning.style.fontSize = '60px';
            enemyWarning.innerHTML = `<img src='assetsPH/attack.png' class='coolIcon' alt='HP'>: ${Entities.bugling.damage + 1}`;

            // Decrease poison for the next turn
            Entities.bugling.poison = Math.max(Entities.bugling.poison - 1, 0);
        }

        cardPlayHTML.innerHTML = `<img src='assetsPH/energy.png' class='coolIcon' alt='HP'>: ${Entities.player.cardPlay}`;

        if (Entities.bugling.health > 0) {
            enemyWarning.style.fontSize = '30px';
            enemyWarning.innerHTML = `Bugman attacks for ${Entities.bugling.damage} damage!`;

            await new Promise(resolve => setTimeout(resolve, 1000));

            enemyWarning.style.fontSize = '60px';
            enemyWarning.innerHTML = `<img src='assetsPH/attack.png' class='coolIcon' alt='Attack'>: ` + (Entities.bugling.damage + 1);

            const damageToTake = Math.max(Entities.bugling.damage - Entities.player.guard, 0);
            playerHealthHTML.innerHTML = `<img src='assetsPH/pHeart.png' class='coolIcon' alt='HP'>` + ": " + (Entities.player.health - damageToTake);
        }

        Entities.player.guard = 0;
        playerGuardHTML.innerHTML = `<img src='assetsPH/defense.png' class='coolIcon' alt='HP'>: ${Entities.player.guard}`;

        if (Entities.player.health <= 0) {
            showDeathScreen();
            break;  // Stop the fight, you died
        }

        let damageModifier = Math.floor(Math.random() * 3);
        if (damageModifier == 0){
            Entities.bugling.damage += 2;
        } else if (damageModifier == 1){
            Entities.bugling.damage += 3;
        } else {
            Entities.bugling.damage += 4;
        }

        Entities.player.turn++;
        playerTurn.innerHTML = `T U R N: ${Entities.player.turn}`

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

    playerCards.forEach((card, index) => {
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
        // Create elements
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



        // Set class, id, and src
        levelHeader.setAttribute("class", "col-12 floorBanner");
        floorNum.setAttribute("id", "turnNumber");
        floorNum.setAttribute("class", "turnNumber");
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



        // Edit text content
        floorNum.textContent = `T U R N: ${Entities.player.turn}`;
        enemyHealth.innerHTML = `<img src='assetsPH/bHeart.png' class='coolIcon' alt='eHP'>: ${Entities.bugling.health}`;
        damageWarning.innerHTML = `<img src='assetsPH/attack.png' class='coolIcon' alt='attack'>: ${Entities.bugling.damage}`;
        playerHealth.innerHTML = `<img src='assetsPH/pHeart.png' class='coolIcon' alt='HP'>: ${Entities.player.health}`;
        playerGuard.innerHTML = `<img src='assetsPH/defense.png' class='coolIcon' alt='Defense';'>: ${Entities.player.guard}`;
        cardPlaysLeft.innerHTML = `<img src='assetsPH/energy.png' class='coolIcon' alt='Energy';'>: ${Entities.player.cardPlay}`;
        endTurnBtn.textContent = "End Turn"


        // Place items on page
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

//Fisher-Yates shuffle algorithm
function shuffleDeck() {
    for (let i = Deck.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [Deck.cards[i], Deck.cards[j]] = [Deck.cards[j], Deck.cards[i]];
    }
}

function DrawInitialHand() {
    Deck.hand = [];

    shuffleDeck();

    // Draw 5 cards into the hand
    for (let i = 0; i < 5; i++) {
        MoveToHand(0); // Move the top card from deck to hand
    }
}

//Creates cards, takes info from Deck class, and puts it onto the cards
function DisplayCards() {
    const handContainer = document.getElementById("playerHand");
    handContainer.innerHTML = '';  // Clear the hand

    for (let i = 0; i < Deck.hand.length; i++) {
        const card = Deck.hand[i];

        // Create a new card element
        const cardElement = document.createElement("div");
        cardElement.className = 'deckCard';

        // Create the card name
        const nameElement = document.createElement("div");
        nameElement.className = 'card-name';
        nameElement.innerHTML = card.name.charAt(0).toUpperCase() + card.name.slice(1);  // Capitalized card name

        // Create and add type image to card
        const costElement = document.createElement("div");
        costElement.className = 'card-cost';
        costElement.innerHTML = `Cost: ${card.cost}`;
        
        // Create the value and effect section with the asset image
        const effectElement = document.createElement("div");
        effectElement.className = 'card-effect';
        
        // Add the type image
        const imgElement = document.createElement("img");
        imgElement.src = card.asset;
        imgElement.alt = `${card.type} icon`;  
        imgElement.style.width = '30px';  
        imgElement.style.height = '30px';   
        imgElement.style.marginLeft = '10px';

        // Combine the value and effect with the image
        effectElement.innerHTML = `Effect: ${card.value}`;
        effectElement.appendChild(imgElement); 

        // Append name, cost, and effect elements to the card element
        cardElement.appendChild(nameElement); 
        cardElement.appendChild(costElement);
        cardElement.appendChild(effectElement); 

        // Append the card element to the hand container
        handContainer.appendChild(cardElement);
    }
}

function CardHandler(i) {
    const enemyHealthHTML = document.getElementById("eHP");
    const cardPlayHTML = document.getElementById("energyLeft");
    const playerGuardHTML = document.getElementById("pGuard");

    if (Deck.hand[i]) {
        if (Deck.hand[i].type === 'attack') {
            Entities.bugling.health -= Deck.hand[i].value;
            enemyHealthHTML.innerHTML = `<img src='assetsPH/bHeart.png' class='coolIcon' alt='eHP'>: ${Entities.bugling.health}`;
        } else if (Deck.hand[i].type === 'defense') {
            Entities.player.guard += Deck.hand[i].value;
            playerGuardHTML.innerHTML = `<img src='assetsPH/defense.png' class='coolIcon' alt='defense'>: ${Entities.player.guard}`;
        } else if (Deck.hand[i].type === 'poison') {
            Entities.bugling.poison += Deck.hand[i].value;
        } else if (Deck.hand[i].type === 'energy') {
            Entities.player.nextTurnExtraCardPlay = true; 
        } 

        Entities.player.cardPlay -= Deck.hand[i].cost; 
        cardPlayHTML.innerHTML = `<img src='assetsPH/energy.png' class='coolIcon' alt='Energy'>: ${Entities.player.cardPlay}`;

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
        const card = Deck.cards.shift(); 
        Deck.hand.push(card); 
    }

    // If we still have space, fill from discard
    while (Deck.hand.length < 5 && Deck.discard.length > 0) {
        const card = Deck.discard.shift(); 
        Deck.hand.push(card); 
    }

    DisplayCards();
}


function MoveToHand(i){
    
    const placeHolderCard = Deck.cards[i];
    Deck.cards.splice(i, 1);
    Deck.hand.push(placeHolderCard);
        
}


function showDeathScreen() {

    const deathScreen = document.createElement('div');
    deathScreen.classList.add('youDiedScreen');
    
    const deathText = document.createElement('h1');
    deathText.innerText = "You Died...";
    deathScreen.appendChild(deathText);
    

    document.body.appendChild(deathScreen);
    
    // Wait for the fade animation before showing the text
    setTimeout(() => {
      deathScreen.classList.add('showText');
    }, 3000);
}