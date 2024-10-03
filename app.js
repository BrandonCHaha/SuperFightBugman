class Deck{
    static cards =[{Cost: 0, Type: 'damage', Value: '2', Name: 'Quick Strike', CardNum: 1}, {Cost: 1, Type: 'damage', Value: '6', Name: 'Slash', CardNum: 2}, {Cost: 1, Type: 'damage', Value: '6', Name: 'Slash', CardNum: 3}, {Cost: 1, Type: 'defense', Value: '4', Name: 'Defenses up!', CardNum: 4}, {Cost: 1, Type: 'defense', Value: '4', Name: 'Defenses up!', CardNum: 5}, {Cost: 2, Type: 'defense', Value: '10', Name: 'Daring Escape', CardNum: 6}]
    static discard;
    static hand;
}

class Entities{
    static player = {health: 30, cardPlay: 3}
    static bugling = {health: 25, damage: 4}
}

CreateBattleUI(1);
DisplayCards();
fight1();


function fight1(){

    const playerCard = document.getElementById("card0")

    let endTurn = 'false';
    let turnMultiplier = 1;

    while(Entities.bugling.health > 0 && Entities.player.health > 0){
        Entities.bugling.damage = (turnMultiplier * 0.5) + Entities.bugling.damage;

        while(Entities.player.cardPlay > 0 && endTurn === 'false'){
            playerCard.addEventListener("click", () => {
                console.log("nuts")
                if (Deck.cards.Type === 'damage'){
                    console.log("balls")
                }
            })
            endTurn = 'true';
        }

        turnMultiplier++;

        Entities.player.health = Entities.player.health - Entities.bugling.damage;
        Entities.bugling.damage = 0;


    }
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
        const playerHealth = document.createElement("h2");
        const cardPlaysLeft = document.createElement("h2");
        const deckContainer = document.createElement("div");
        const playerHand = document.createElement("div");

        const numCollumn = document.createElement("div");
        const row1 = document.createElement("div");
        const row2 = document.createElement("div");
        const row3 = document.createElement("div");
        const row4 = document.createElement("div");



        levelHeader.setAttribute("class", "col-12 floorBanner");
        enemyContainer.setAttribute("class", "col-12 enemyContainer");
        enemyImg.setAttribute("src", "assetsPH/enemy.png")
        enemyImg.setAttribute("class", "enemyImg")
        numCollumn.setAttribute("class", "col-2")
        playerContainer.setAttribute("class", "col-12 playerContainer")
        playerImg.setAttribute("src", "assetsPH/player.png")
        deckContainer.setAttribute("class", "col-2 deckContainer")
        playerHand.setAttribute("class", "col-10")
        playerHand.setAttribute("id", "playerHand")

        row1.setAttribute("class", "row");
        row2.setAttribute("class", "row");
        row3.setAttribute("class", "row");
        row4.setAttribute("class", "row");



        floorNum.textContent = floor;
        enemyHealth.textContent = Entities.bugling.health;
        damageWarning.textContent = Entities.bugling.damage;
        playerHealth.textContent = Entities.player.health;
        cardPlaysLeft.textContent = Entities.player.cardPlay;



        levelHeader.appendChild(floorNum)
        row1.appendChild(levelHeader)
        gameScreen.appendChild(row1)
        enemyContainer.appendChild(enemyImg)
        numCollumn.appendChild(enemyHealth)
        numCollumn.appendChild(damageWarning)
        row2.appendChild(numCollumn)
        row2.appendChild(enemyContainer)
        gameScreen.appendChild(row2)
        playerContainer.appendChild(playerImg)
        row3.appendChild(playerContainer);
        gameScreen.appendChild(row3)

        deckContainer.appendChild(playerHealth);
        deckContainer.appendChild(cardPlaysLeft);
        row4.appendChild(deckContainer);
        row4.appendChild(playerHand)
        gameScreen.appendChild(row4)


    }

}

//creates cards, takes info from Deck class, and puts it onto the cards
function DisplayCards(){

    document.getElementById('playerHand').innerHTML = '';

	for(let i = 0; i < 5; i++){
		const card = document.createElement("div");
		const value = document.createElement("h4");
        const cost = document.createElement("h4");
        const cardName = document.createElement("h5");

        card.setAttribute("class", "col-2 deckCard")
        card.setAttribute("id", `"card${[i]}"`)
        value.setAttribute("class", "value")
        cost.setAttribute("class", "cost")


		value.textContent = Deck.cards[i].Value;
        cost.textContent = Deck.cards[i].Cost;
        cardName.textContent = Deck.cards[i].Name;

		card.appendChild(cost);
		card.appendChild(cardName);
		card.appendChild(value);


		document.getElementById("playerHand").appendChild(card);
	}
}

