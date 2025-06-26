<script setup lang="ts">
import type { Player } from '@/stores/typs.ts'
import { computed, ref, type Ref } from 'vue'
import ListOfMatchUps from "@/components/ListOfMatchUps.vue";
import FinishedView from "@/components/FinishedView.vue";

const players: Ref<Player[]> = ref([])
const matchUps: Ref<object> = ref({})
const round: Ref<number> = ref(1)
const matchupSize: Ref<number> = ref(2)
let gameHasStarted = false
let gameHasFinished = false

const addToPlayers = () => {
  const input: HTMLInputElement | null = document.querySelector('#user')
  if (input?.value) {
    players.value.push({
      name: input!!.value,
      hasWonGame: null,
      matchesWon: 0,
      randomValue: 0,
    })
  } else {
  }
}

const getCheckBoxValue = computed(() => {
  const querySelector: HTMLInputElement | null = document.querySelector("#drop-players-that-have-lost");
  return querySelector?.checked;
});

const getMaxMatchSizeInputValue = computed(() => {
  const querySelector: HTMLInputElement | null = document.querySelector("#number-of-players-per-game");
  if (querySelector?.value){

    if (parseInt(querySelector?.value ) >= 4 ) return "4";
    if (parseInt(querySelector?.value ) <= 2 ) return "2";

    return querySelector?.value;
  }
  return "2";
});

const removePlayer = (index: number) => {
  players.value.splice(index, 1)
}

const startNextRound = (match: [Player[]]) => {
  round.value++;

  if (amountOfMatches + 1 < round.value){
    gameHasFinished = true;
    return
  }

  let allPlayers: Player[] = JSON.parse(JSON.stringify(match.flat(2)));
  console.log(getCheckBoxValue.value);
  if (getCheckBoxValue.value){
    allPlayers = allPlayers.filter((player: Player) => {return player.hasWonGame === true});
    console.log(allPlayers);
  }
  allPlayers.sort((player1: Player, player2: Player) => player2.matchesWon - player1.matchesWon);


    allPlayers.forEach((player: Player, index: number) => {
      player.hasWonGame = null;
      if ((index + 1) % matchupSize.value === 0) {
        const match = [];
        for (let i = 0; i < matchupSize.value; i++) {
          match.push(allPlayers[index - i]);
        }
        if (match.length > 0) {
          matchUps.value[`${round.value}`].push(match);
        }
      }
    });
    if (matchUps.value[`${round.value}`].length !== allPlayers.length / matchupSize.value) {
      const playersThatHaveFoundAMatchUp = matchUps.value[`${round.value}`].length * matchupSize.value
      const match: Player[] = [];
      allPlayers.forEach((player: Player, index: number) => {
        if (index + 1 > playersThatHaveFoundAMatchUp) {
          match.push(allPlayers[index]);
        }
        if (allPlayers.length === index + 1) {
          matchUps.value[`${round.value}`].push(match);
        }
      });
    }

    console.log(round.value)
    console.log(amountOfMatches)
}


let amountOfMatches: number;
const setAmountOfMatches = () => {
// einfach nicht nachfragen, was ich hier am Kochen war
  let r = 0;
  let x = players.value.length;
  do {
    x = x / matchupSize.value;
    if (x <= 1 ) {
      break;
    }
    r++;
  } while (true);
  if (r === 0){
    amountOfMatches = 1;
  }
  amountOfMatches = r;
}

const startsGame = () => {
  gameHasStarted = true;
  setAmountOfMatches();
  matchupSize.value = parseInt(getMaxMatchSizeInputValue.value);
  for (let i = 1; i - 1 <= amountOfMatches; i++) {
    // ist schon ok hier
    matchUps.value[`${i}`] = [];
  }

  players.value.forEach((player) => (player.randomValue = Math.random()))
  players.value = players.value.sort(
    (player1, player2) => player1.randomValue - player2.randomValue
  )
  players.value.forEach((player, index) => {
    if ((index + 1) % matchupSize.value === 0) {
      const match = []
      for (let i = 0; i < matchupSize.value; i++) {
        match.push(players.value[index - i])
      }
      if (match.length > 0) {
        matchUps.value[1].push(match)
      }
    }
  })
  if (matchUps.value[1].length !== players.value.length  / matchupSize.value) {
    const playersThatHaveFoundAMatchUp = matchUps.value[1].length * matchupSize.value
    const match: Player[] = []
    players.value.forEach((player, index) => { // spieler anzahl pro match ist noch nicht richtig
      if (index + 1 > playersThatHaveFoundAMatchUp) {
        match.push(player)
      }
      if (players.value.length === index + 1) {
        matchUps.value[1].push(match);
      }
    })
  }
  console.log(matchUps.value);
}
</script>

<template>
  <body>
    <section class="inputs">
      <label for="user">Spieler name: </label>
      <input
        type="text"
        name="user"
        id="user"
        @keydown.enter="!gameHasStarted ? addToPlayers() : null"
        :disabled="gameHasStarted"
      />
      <label for="number-of-players-per-game">anzahl Spieler pro spiel: </label>
      <input type="number" id="number-of-players-per-game" name="number-of-players-per-game" max="4" min="2" value="2" :disabled="gameHasStarted">
      <label for="drop-players-that-have-lost">Drop Player if they lose: </label>
      <input type="checkbox" id="drop-players-that-have-lost" name="drop-players-that-have-lost" :disabled="gameHasStarted">
      <button @click="addToPlayers" :disabled="gameHasStarted">add player</button>
      <button v-if="!gameHasStarted" @click="startsGame" :disabled="parseInt(getMaxMatchSizeInputValue) > players.length">Start Game</button>
      <a href=""><button>Reset</button></a>
    </section>
    <aside id="player-lobby">
      <h3>Players</h3>
      <ul>
        <li
          v-for="(player, index) in players"
          @click="!gameHasStarted ? removePlayer(index) : null"
        >
          {{ player.name }} Wins: {{ player.matchesWon }}
        </li>
      </ul>
    </aside>

  <div v-if="gameHasStarted">
    <div v-for="(match: Player[][]) in matchUps">
      <list-of-match-ups  :match-ups="match" v-if="match[0]" @submit-match="startNextRound" :current-round="round">

      </list-of-match-ups>
    </div>
  </div>
  <div v-if="gameHasFinished">
    <finished-view></finished-view>
  </div>
  </body>
</template>
<style>
body {
  background-color: darkgrey;
  height: 100%;
}

.inputs {
  text-align: center;
}

#player-lobby{
  background-color: aliceblue;
  width: 300px;
  border: aliceblue solid 1px;

  & li{
    margin: 1px;
    background-color: darkgrey;
  }
}
</style>
