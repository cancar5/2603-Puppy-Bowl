// === Constants ===

const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2603-Casey"; // Make sure to change this!
const RESOURCE = "/players/";
const API = BASE + COHORT;

console.log("API", API);

// ======      STATE      =======

let players = [];
let selectedPlayer = null;
let id;

// ======      STATE CHANGING FUNCTIONS     =======

// GET ALL PLAYERS
async function getPlayers() {
  try {
    const response = await fetch(API + RESOURCE);
    const result = await response.json(); //turn into JS object
    players = result.data.players; //populating state
    render();
  } catch (e) {
    console.error("There was an error fetching all players", e);
  }
}

/** Updates state with a single player from the API */
async function getSinglePlayer(id) {
  try {
    const response = await fetch(API + RESOURCE + id);
    const result = await response.json();
    selectedPlayer = result.data.player;
    render();
  } catch (e) {
    console.error("There was an error getting single player", e);
  }
}

//Invite a new puppy
async function addPuppy() {
  try {
    await fetch(API, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    await getPlayers();
  } catch (e) {
    console.error("There was an error on addArtist", e);
  }
}

//Deletes the artist with the given ID via the API

async function removePlayer(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    getPlayers();
  } catch (e) {
    console.error("There was an error in removeArtist", e);
  }
}

// // =======     COMPONENTS  =========

// //Player name that shows more details about the player when clicked

function PlayerCard(player) {
  const $singlePlayer = document.createElement("article");

  if (player.id === selectedPlayer?.id) {
    $singlePlayer.classList.add("puppies");
  }

  $singlePlayer.innerHTML = `    
    
      <a href="#selected">${player.name}</a>
   
  `;

  $singlePlayer.addEventListener("click", function () {
    getSinglePlayer(player.id);

    render();
  });
  return $singlePlayer;
}

//A list of names of all players
function PlayerList() {
  if (!players || players.length === 0) {
    return document.createElement("div"); // Or return null/empty element
  }

  const $ul = document.createElement("ul");
  $ul.classList.add("puppies");

  const $players = players.map(PlayerCard);

  $ul.append(...$players); ///gets full list of children. dont use replaceChildren

  return $ul;
}

/** Detailed information about the selected artist */
function PuppyDetails(player) {
  if (!player) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }
  const $section = document.createElement("ul");
  $section.classList.add("puppies");

  $section.innerHTML = `
  <figure>
      <img alt=${player.name} src=${player.imageUrl} width="150" alt="player.name" />
    </figure>
    <ul>
    <li>Name: ${player.name} </li> 
    <li>Id: #${player.id}</li>
    <li>Breed: ${player.breed}</li>
    <li>Status: ${player.status}</li>
    <li>TeamId:${player.teamId}</li>
</ul>
    <button>Remove Player</button>
  `;

  const $delete = $section.querySelector("button");
  $delete.addEventListener("click", async function (event) {
    await removePlayer(player.id);
    render();
  });

  return $section;
}

function NewPlayerForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
     <label>
      Status
      <input name="status" required />
    </label>
    <label>
      Image URL
      <input name="imageUrl" required />
    </label>
    <button>Invite Player</button>
  `;

  $form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = new FormData($form);
    addPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: data.get("imageUrl"),
    });
  });
  return $form;
}

// // ========     RENDER     =========

function render() {
  const $app = document.querySelector("#app");

  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Player List</h2>
        <PlayerList></PlayerList>

        <h3>Invite a Puppy</h3>
        <NewPlayerForm></NewPlayerForm>
      </section>

      <section id="selected">
        <h2>Puppy Details</h2>
        <PuppyDetails></PuppyDetails>
      </section>
    </main>
  `;

  $app.querySelector("PlayerList").replaceWith(PlayerList());
  $app.querySelector("NewPlayerForm").replaceWith(NewPlayerForm());
  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails(selectedPlayer));
}

// initialize app
async function init() {
  await getPlayers();
  render();
}

init();
// render();
