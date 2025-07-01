<script setup lang="ts">
import type {Player} from '@/stores/typs.ts'
import {computed, ref, type Ref} from 'vue'
import ListOfMatchUps from "@/components/ListOfMatchUps.vue";
import FinishedTable from "@/components/FinishedTable.vue";
import PlayerSideBar from "@/components/PlayerSideBar.vue";

const players: Ref<Player[]> = ref([]);
const matchUps: Ref<any> = ref({});
const round: Ref<number> = ref(1);
const matchupSize: Ref<number> = ref(2);
const gameHasStarted: Ref<boolean> = ref(false);
const gameHasFinished: Ref<boolean> = ref(false);

const amountOfMatches = computed(() =>{
  // einfach nicht nachfragen, was ich hier am Kochen war
  let r = 0;
  let x = players.value.length;
  do {
    x = x / matchupSize.value;
    if (x <= 1) {
      break;
    }
    r++;
  } while (true);
  if (r === 0) {
    return 1;
  }
  return r;
});

const addToPlayers = (playerName: string) => {
  if (playerName.length > 0) {
    players.value.push({
      name: playerName,
      hasWonGame: null,
      matchesWon: 0,
      randomValue: 0,
    })
  }
}

const getCheckBoxValue = computed(() => {
  const querySelector: HTMLInputElement | null = document.querySelector("#drop-players-that-have-lost");
  return querySelector?.checked;
});


const removePlayer = (index: number) => {
  players.value.splice(index, 1)
}


const startNextRound = (match: Player[][]) => {
  round.value++;

  if (amountOfMatches.value + 1 < round.value) {
    gameHasFinished.value = true;
    return
  }

  let allPlayers: Player[] = JSON.parse(JSON.stringify(match.flat(2)));
  console.log(getCheckBoxValue.value);
  if (getCheckBoxValue.value) {
    allPlayers = allPlayers.filter((player: Player) => {
      return player.hasWonGame === true
    });
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




const startsGame = () => {

  for (let i = 1; i - 1 <= amountOfMatches.value; i++) {
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
  if (matchUps.value[1].length !== players.value.length / matchupSize.value) {
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
  gameHasStarted.value = true;
  console.log(matchUps.value);
  console.log(gameHasStarted)
}
</script>

<template>
  <body>
  <section class="inputs">
    <label for="number-of-players-per-game">anzahl Spieler pro spiel: </label>
    <input type="number" id="number-of-players-per-game" name="number-of-players-per-game" min="2" value="2" v-model="matchupSize"
           :disabled="gameHasStarted">
    <label for="drop-players-that-have-lost">Drop Player if they lose: </label>
    <input type="checkbox" id="drop-players-that-have-lost" name="drop-players-that-have-lost"
           :disabled="gameHasStarted">
    <button v-if="!gameHasStarted" @click="startsGame" :disabled="matchupSize > players.length">
      Start Game
    </button>
    <a href="">
      <button>Reset</button>
    </a>
  </section>
  <aside id="player-lobby">
    <PlayerSideBar :game-has-started="gameHasStarted" :players="players" @remove="removePlayer" @add="addToPlayers"></PlayerSideBar>
  </aside>
  <div id="main">
    <div v-if="gameHasStarted">
      <div v-for="(match, index) in matchUps" v-bind:key="index">
        <list-of-match-ups :match-ups="match" v-if="match[0]" @submit-match="startNextRound" :current-round="index">

        </list-of-match-ups>
      </div>
    </div>
    <div v-if="gameHasFinished">
      <finished-table></finished-table>
    </div>
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

#player-lobby {
  background-color: aliceblue;
  width: 15%;
  border: aliceblue solid 1px;
  float: left;
}

#main{
  background-color: gold;
  width: 70%;
  display: flex;
  margin: 0 15%;
  overflow: scroll;
}
</style>
