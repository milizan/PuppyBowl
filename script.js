/**
 * Gets players & newPlayer containers from the DOM
 */
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-pt-web-pt-a';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL+'players');
        const players = await response.json();
        return players.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        throw err;
    }
};

// Fetch details of a Single Player by passing the PlayerId
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL+'players/'+playerId);
        const player = await response.json();
        console.log(player.data.player);
        return player.data.player;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};


//Function to add a new player 
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL+'players', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj)
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

//Function to remove a player by playerId and afterwards returns allplayers
const removePlayer = async (playerId) => {
    try {
        await fetch(APIURL+'players/'+playerId,
        { 
            method: 'DELETE',
        })
        const players = await fetchAllPlayers();
        playerContainer.innerHTML = ''
        await renderAllPlayers(players)
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <p>${player.id}</p>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <button class="details-button" data-id="${player.id}">See Details</button>
                <button class="delete-button" data-id="${player.id}">Delete</button>
            `;
            playerContainer.appendChild(playerElement);

            // details button
            const detailsButton = playerElement.querySelector(".details-button");
            detailsButton.addEventListener("click", async (event) => {
        
                    //show the details of the player clicked
                    renderSinglePlayerById(player.id);
                });   
             const deleteButton = playerElement.querySelector(".delete-button");
             deleteButton.addEventListener("click", async (event) => {
        
                //show the details of the player clicked
                removePlayer(player.id);
            });      
        
               }
        
        )
 
        
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};
const renderSinglePlayerById = async (id) => {
//    console.log("hello")
    try {
        const player = await fetchSinglePlayer(id);
        //console.log(player);

        const playerDetailsElememt = document.createElement("div");
          playerDetailsElememt.classList.add("player-details");
          playerDetailsElememt.innerHTML = `
                  <h2>${player.name}</h2>
                  <p><img src = "${player.imageUrl}"></p>
                  <p>ID:${player.id}</p>
                  <p>Breed:${player.breed}</p>
                  <p>Status:${player.status}</p>
                  <p>Created at:${player.createdAt}</p>
                  <p>Updated at:${player.updatedAt}</p>
                  <p>Team ID:${player.teamId}</p>
                  <p>Cohort ID:${player.cohortId}</p>
                  <button class="close-button">Close</button>
              `;

          playerContainer.appendChild(playerDetailsElememt);
    
     // add event listener to close button
          const closeButton =
            playerDetailsElememt.querySelector(".close-button");
            closeButton.addEventListener("click", () => {
            playerDetailsElememt.remove();
            togglePlayerListVisibility("flex");
          });
        } 
        catch (err) {
          console.error(`Uh oh, trouble rendering player #${playerId}!`, err);
        }
};




/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        let formHTML = `
        <div id="intro-statement">
        <header>
        <h1> Welcome to the 2023 Puppy Bowl !</h1>
        </header>
        <p> The most anticipated event of the year ! 
        <br>You can add your puppy to be part of this awesome game.
        <br>Get ready for some fun.
        </p>
        <hr>
        </div>
        <h3>Want to add your furry player? </h3>
        <form id="add-player-form">
            <label>Name </label>
            <input type="text" name="name" placeholder="" required><br><br>
            <label for="input-breed">Breed: </label>
            <input type="text" id="input-breed" name="input-breed" placeholder="" required><br><br>
            <label>Status: </label>
            <select name="status">
              <option value="bench">Bench</option>
              <option value="field">Field</option>
            </select><br><br>
            <label>ImageUrl: </label>
            <input type="url" name="imageUrl" value="https://pngtree.com/freepng/hand-drawn-brown-puppy-clipart_5552068.html" placeholder="https://pngtree.com/freepng/hand-drawn-brown-puppy-clipart_5552068.html" required><br><br>
            <label>TeamId: </label>
            <input type="number" name="teamId" placeholder="" required><br><br>
            <input type="submit" id="input-submit" value="Add Your Puppy">
        </form>

    `;
    newPlayerFormContainer.innerHTML = formHTML;

     // for submit events, add the event listener to the entire form
     const addPlayerForm = document.getElementById("add-player-form");
     const inputSubmit = document.getElementById("input-submit");
     inputSubmit.addEventListener("click", async (event) => {
       event.preventDefault();
       console.log("Player submit clicked");
       const playerName = addPlayerForm.elements.name.value;
       const playerBreed = addPlayerForm.elements["input-breed"].value;
       const playerStatus = addPlayerForm.elements.status.value;
       const playerImageUrl = addPlayerForm.elements.imageUrl.value;
 
       const newPlayer = {
         name: playerName,
         breed: playerBreed,
         status: playerStatus,
         imageUrl: playerImageUrl,
       };
 
       await addNewPlayer(newPlayer);
       console.log(newPlayer);
       location.reload();
     });



    } catch (err) {
        console.error('Uh oh, trouble rendering the new puppy form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    await renderAllPlayers(players);

    renderNewPlayerForm();

}

init();